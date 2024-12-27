import express, { Router, Request, Response } from 'express'

const router = Router()

interface IFavoriteBody {
  userId: string;
  wallpaperId: string;
}

interface IFavoriteStatusBody {
  userId: string;
  wallpaperIds: string[];
}

// 模拟用户数据存储
const favorites = new Map<string, Set<string>>()
const downloads = new Map<string, Set<string>>()

// 添加收藏
router.post('/favorites', (req: Request<{}, {}, IFavoriteBody>, res: Response) => {
  const { userId, wallpaperId } = req.body
  if (!favorites.has(userId)) {
    favorites.set(userId, new Set())
  }
  favorites.get(userId)?.add(wallpaperId)
  res.json({ code: 0, message: '收藏成功' })
})

// 取消收藏
router.delete('/favorites', (req: Request<{}, {}, IFavoriteBody>, res: Response) => {
  const { userId, wallpaperId } = req.body
  favorites.get(userId)?.delete(wallpaperId)
  res.json({ code: 0, message: '取消收藏成功' })
})

// 获取收藏状态
router.post('/favorites/status', (req: Request<{}, {}, IFavoriteStatusBody>, res: Response) => {
  const { userId, wallpaperIds } = req.body
  const userFavorites = favorites.get(userId) || new Set()
  const status = wallpaperIds.map((id: string) => userFavorites.has(id))
  res.json({ code: 0, data: status })
})

// 记录下载
router.post('/downloads', (req: Request<{}, {}, IFavoriteBody>, res: Response) => {
  const { userId, wallpaperId } = req.body
  if (!downloads.has(userId)) {
    downloads.set(userId, new Set())
  }
  downloads.get(userId)?.add(wallpaperId)
  res.json({ code: 0, message: '记录下载成功' })
})

export { router } 