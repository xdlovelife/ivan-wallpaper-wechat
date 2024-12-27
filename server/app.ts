import * as express from 'express'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import { wallpaperRoutes } from './routes/wallpaper'

// 加载环境变量
dotenv.config()

const app = express.default()
const port = process.env.PORT || 3000

// 中间件
app.use(cors.default())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use('/api/wallpapers', wallpaperRoutes)

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    msg: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
}) 