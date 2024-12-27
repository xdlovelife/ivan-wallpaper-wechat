import * as express from 'express';
import pool from '../config/database';

const router = express.Router();

// 获取壁纸列表
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (page - 1) * pageSize;

    // 获取总数
    const [countResult]: any = await pool.query('SELECT COUNT(*) as total FROM wallpapers');
    const total = countResult[0].total;

    // 获取数据
    const [rows] = await pool.query(
      'SELECT * FROM wallpapers ORDER BY id DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );

    res.json({
      code: 0,
      msg: 'success',
      data: {
        list: rows,
        total,
        page,
        pageSize,
        hasMore: offset + pageSize < total
      }
    });
  } catch (error) {
    console.error('获取壁纸列表失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取壁纸列表失败'
    });
  }
});

// 获取壁纸详情
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM wallpapers WHERE id = ?',
      [req.params.id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      res.json({
        code: 0,
        msg: 'success',
        data: rows[0]
      });
    } else {
      res.status(404).json({
        code: 404,
        msg: '壁纸不存在'
      });
    }
  } catch (error) {
    console.error('获取壁纸详情失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取壁纸详情失败'
    });
  }
});

export const wallpaperRoutes = router; 