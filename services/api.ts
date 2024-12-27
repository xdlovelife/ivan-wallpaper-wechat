import { IWallpaper, ISearchParams } from '../types/wallpaper'
import { ErrorHandler } from '../utils/error'

// 缓存配置
const CACHE_CONFIG = {
  KEYS: {
    WALLPAPERS: 'cached_wallpapers',
    SEARCH_RESULTS: 'cached_search_results',
    CATEGORIES: 'cached_categories',
    CACHE_TIME: 'cache_timestamp'
  },
  DURATION: 30 * 60 * 1000 // 30分钟
}

// API响应类型
interface IApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export class ApiService {
  private static instance: ApiService
  private baseUrl: string
  private imageBaseUrl: string

  private constructor() {
    this.baseUrl = 'http://localhost:3000/api'
    this.imageBaseUrl = 'http://localhost:3000/images'
  }

  // 单例模式
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  // 基础请求方法
  private async request<T>(options: {
    url: string;
    method?: string;
    data?: any;
    useCache?: boolean;
    cacheKey?: string;
  }): Promise<T> {
    const { url, method = 'GET', data, useCache = false, cacheKey } = options

    // 检查缓存
    if (useCache && cacheKey) {
      const cached = this.getCachedData<T>(cacheKey)
      if (cached) return cached
    }

    try {
      const response = await wx.request<IApiResponse<T>>({
        url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
        method: method as 'GET' | 'POST',
        data,
        header: {
          'Content-Type': 'application/json'
        }
      })

      if (response.statusCode !== 200) {
        throw new Error(`HTTP错误: ${response.statusCode}`)
      }

      const { code, data: responseData, message } = response.data
      if (code !== 0) {
        throw new Error(message || '请求失败')
      }

      // 设置缓存
      if (useCache && cacheKey) {
        this.setCachedData(cacheKey, responseData)
      }

      return responseData
    } catch (error: any) {
      const err = error.message.includes('HTTP错误') 
        ? ErrorHandler.handleApiError(error)
        : ErrorHandler.handleNetworkError(error)
      
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 获取缓存数据
  private getCachedData<T>(key: string): T | null {
    try {
      const cacheTime = wx.getStorageSync(CACHE_CONFIG.KEYS.CACHE_TIME)
      if (!cacheTime || Date.now() - cacheTime > CACHE_CONFIG.DURATION) {
        return null
      }
      return wx.getStorageSync(key)
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.logError(err)
      return null
    }
  }

  // 设置缓存数据
  private setCachedData(key: string, data: any): void {
    try {
      wx.setStorageSync(key, data)
      wx.setStorageSync(CACHE_CONFIG.KEYS.CACHE_TIME, Date.now())
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.logError(err)
    }
  }

  // 处理图片URL
  private processImageUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}): string {
    const { width, height, quality = 80 } = options
    let processedUrl = url

    if (!url.startsWith('http')) {
      processedUrl = `${this.imageBaseUrl}/${url}`
    }

    const params = new URLSearchParams()
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('q', quality.toString())

    return `${processedUrl}?${params.toString()}`
  }

  // 搜索壁纸
  async searchWallpapers(params: ISearchParams) {
    const cacheKey = `${CACHE_CONFIG.KEYS.SEARCH_RESULTS}_${JSON.stringify(params)}`
    
    const data = await this.request<{
      list: IWallpaper[];
      hasMore: boolean;
    }>({
      url: '/wallpapers/search',
      method: 'GET',
      data: params,
      useCache: true,
      cacheKey
    })

    // 处理图片URL
    data.list = data.list.map(item => ({
      ...item,
      url: this.processImageUrl(item.url),
      thumbnail: this.processImageUrl(item.thumbnail, {
        width: 300,
        height: 400,
        quality: 75
      })
    }))

    return data
  }

  // 获取相似壁纸
  async getSimilarWallpapers(id: number) {
    const cacheKey = `similar_wallpapers_${id}`
    
    const data = await this.request<IWallpaper[]>({
      url: `/wallpapers/${id}/similar`,
      useCache: true,
      cacheKey
    })

    return data.map(item => ({
      ...item,
      url: this.processImageUrl(item.url),
      thumbnail: this.processImageUrl(item.thumbnail, {
        width: 300,
        height: 400,
        quality: 75
      })
    }))
  }

  // 获取壁纸标签
  async getWallpaperTags(id: number) {
    const cacheKey = `wallpaper_tags_${id}`
    
    return this.request<string[]>({
      url: `/wallpapers/${id}/tags`,
      useCache: true,
      cacheKey
    })
  }

  // 获取每日推荐
  async getDailyRecommendations() {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `daily_recommendations_${today}`
    
    const data = await this.request<IWallpaper[]>({
      url: '/wallpapers/daily',
      useCache: true,
      cacheKey
    })

    return data.map(item => ({
      ...item,
      url: this.processImageUrl(item.url),
      thumbnail: this.processImageUrl(item.thumbnail, {
        width: 300,
        height: 400,
        quality: 75
      })
    }))
  }
}

// 导出单例实例
export const api = ApiService.getInstance() 