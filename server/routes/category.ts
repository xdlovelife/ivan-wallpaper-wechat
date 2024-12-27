import express, { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../db';

const router = express.Router();

// 获取所有分类
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT * FROM categories';
    if (type) {
      query += ' WHERE type = ?';
    }
    query += ' ORDER BY `order` ASC';
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      query,
      type ? [type] : []
    );
    
    // 按类型分组
    const grouped = rows.reduce((acc: any, cur: any) => {
      if (!acc[cur.type]) {
        acc[cur.type] = [];
      }
      acc[cur.type].push(cur);
      return acc;
    }, {});
    
    res.json({
      code: 0,
      data: grouped
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

// 获取分类详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '分类不存在'
      });
    }
    
    res.json({
      code: 0,
      data: rows[0]
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  }
});

export const categoryRouter = router; 