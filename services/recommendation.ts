import { ErrorHandler } from '../utils/error'
import { IWallpaper } from '../types/wallpaper'
import { RatingService } from './rating'
import { CollectionService } from './collection'

export class RecommendationService {
  // 获取用户喜好标签
  private static async getUserPreferenceTags() {
    try {
      // 获取用户收藏的壁纸
      const collections = await CollectionService.getCollections()
      const wallpaperIds = collections.reduce((acc, cur) => {
        return [...acc, ...cur.wallpapers]
      }, [] as number[])

      // 获取这些壁纸的标签
      const tags: Record<string, number> = {}
      for (const id of wallpaperIds) {
        const wallpaperTags = await wx.request({
          url: `http://localhost:3000/api/wallpapers/${id}/tags`
        })
        
        if (wallpaperTags.data) {
          wallpaperTags.data.forEach((tag: string) => {
            tags[tag] = (tags[tag] || 0) + 1
          })
        }
      }

      // 按出现频率排序
      return Object.entries(tags)
        .sort(([, a], [, b]) => b - a)
        .map(([tag]) => tag)
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      return []
    }
  }

  // 获取个性化推荐
  static async getPersonalizedRecommendations() {
    try {
      const preferenceTags = await this.getUserPreferenceTags()
      
      if (preferenceTags.length === 0) {
        // 如果没有用户喜好数据,返回热门壁纸
        const response = await wx.request({
          url: 'http://localhost:3000/api/wallpapers/popular'
        })
        return response.data as IWallpaper[]
      }

      // 基于用户喜好标签获取推荐
      const response = await wx.request({
        url: 'http://localhost:3000/api/wallpapers/recommend',
        data: { tags: preferenceTags.slice(0, 5) }
      })

      return response.data as IWallpaper[]
    } catch (error) {
      const err = ErrorHandler.handleApiError(error)
      ErrorHandler.showError(err)
      return []
    }
  }

  // 获取相似壁纸
  static async getSimilarWallpapers(wallpaperId: number) {
    try {
      const response = await wx.request({
        url: `http://localhost:3000/api/wallpapers/${wallpaperId}/similar`
      })
      return response.data as IWallpaper[]
    } catch (error) {
      const err = ErrorHandler.handleApiError(error)
      ErrorHandler.showError(err)
      return []
    }
  }

  // 获取每日推荐
  static async getDailyRecommendations() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const cacheKey = `daily_recommendations_${today}`
      
      // 检查缓存
      const cached = wx.getStorageSync(cacheKey)
      if (cached) return cached as IWallpaper[]

      // 获取新的推荐
      const response = await wx.request({
        url: 'http://localhost:3000/api/wallpapers/daily'
      })

      const recommendations = response.data as IWallpaper[]
      wx.setStorageSync(cacheKey, recommendations)

      return recommendations
    } catch (error) {
      const err = ErrorHandler.handleApiError(error)
      ErrorHandler.showError(err)
      return []
    }
  }

  // 获取基于评分的推荐
  static async getRatingBasedRecommendations() {
    try {
      // 获取用户评分过的壁纸
      const collections = await CollectionService.getCollections()
      const wallpaperIds = collections.reduce((acc, cur) => {
        return [...acc, ...cur.wallpapers]
      }, [] as number[])

      // 获取这些壁纸的评分
      const ratings: Record<number, number> = {}
      for (const id of wallpaperIds) {
        const score = await RatingService.getAverageRating(id)
        if (score > 0) {
          ratings[id] = score
        }
      }

      // 基于评分获取推荐
      const response = await wx.request({
        url: 'http://localhost:3000/api/wallpapers/recommend',
        data: { ratings }
      })

      return response.data as IWallpaper[]
    } catch (error) {
      const err = ErrorHandler.handleApiError(error)
      ErrorHandler.showError(err)
      return []
    }
  }
} 