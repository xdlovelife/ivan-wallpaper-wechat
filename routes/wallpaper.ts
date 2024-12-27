import express from 'express';
import { pool } from '../config/db';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

interface Wallpaper extends RowDataPacket {
  id: number;
  url: string;
  title: string;
  description: string;
  created_at: Date;
}

const router = express.Router();

// 获取壁纸列表
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<Wallpaper[]>('SELECT * FROM wallpapers');
    res.json({
      code: 0,
      msg: '获取成功',
      data: rows
    });
  } catch (error: any) {
    console.error('获取壁纸列表失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取壁纸列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 获取壁纸详情
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<Wallpaper[]>('SELECT * FROM wallpapers WHERE id = ?', [req.params.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: '壁纸不存在'
      });
    }
    res.json({
      code: 0,
      msg: '获取成功',
      data: rows[0]
    });
  } catch (error: any) {
    console.error('获取壁纸详情失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取壁纸详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export const wallpaperRoutes = router; 