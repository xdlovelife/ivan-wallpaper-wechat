import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { wallpaperRoutes } from './routes/wallpaper';

// 加载环境变量
config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || 'localhost';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/wallpapers', wallpaperRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    msg: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(port, host, () => {
  console.log(`服务器运行在 http://${host}:${port}`);
}); 