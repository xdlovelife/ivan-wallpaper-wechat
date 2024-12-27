import { ErrorHandler } from '../utils/error'

// 评分记录
interface IRating {
  wallpaper_id: number;
  user_id: string;
  score: number;
  comment?: string;
  created_at: string;
}

export class RatingService {
  // 获取壁纸评分
  static async getWallpaperRatings(wallpaperId: number) {
    try {
      const ratings = wx.getStorageSync(`ratings_${wallpaperId}`) || []
      return ratings as IRating[]
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      return []
    }
  }

  // 添加评分
  static async addRating(rating: Omit<IRating, 'created_at'>) {
    try {
      const ratings = await this.getWallpaperRatings(rating.wallpaper_id)
      
      // 检查是否已评分
      const existingIndex = ratings.findIndex(
        r => r.user_id === rating.user_id
      )

      const newRating = {
        ...rating,
        created_at: new Date().toISOString()
      }

      if (existingIndex > -1) {
        ratings[existingIndex] = newRating
      } else {
        ratings.push(newRating)
      }

      wx.setStorageSync(`ratings_${rating.wallpaper_id}`, ratings)

      return newRating
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 删除评分
  static async deleteRating(wallpaperId: number, userId: string) {
    try {
      const ratings = await this.getWallpaperRatings(wallpaperId)
      const newRatings = ratings.filter(r => r.user_id !== userId)
      wx.setStorageSync(`ratings_${wallpaperId}`, newRatings)
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 获取平均评分
  static async getAverageRating(wallpaperId: number) {
    try {
      const ratings = await this.getWallpaperRatings(wallpaperId)
      if (ratings.length === 0) return 0
      
      const sum = ratings.reduce((acc, cur) => acc + cur.score, 0)
      return Number((sum / ratings.length).toFixed(1))
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      return 0
    }
  }
} 