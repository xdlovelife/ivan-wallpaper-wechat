import { IWallpaper } from '../types/wallpaper'

// 缓存键
const CACHE_KEYS = {
  WALLPAPERS: 'cached_wallpapers',
  SEARCH_RESULTS: 'cached_search_results',
  CATEGORIES: 'cached_categories',
  CACHE_TIME: 'cache_timestamp'
}

// 缓存时间 (30分钟)
const CACHE_DURATION = 30 * 60 * 1000

export class ApiService {
  private baseUrl: string
  private imageBaseUrl: string

  constructor() {
    this.baseUrl = 'http://localhost:3000/api'
    this.imageBaseUrl = 'http://localhost:3000/images'
  }

  // 获取缓存的数据
  private getCachedData<T>(key: string): T | null {
    try {
      const cacheTime = wx.getStorageSync(CACHE_KEYS.CACHE_TIME)
      if (!cacheTime || Date.now() - cacheTime > CACHE_DURATION) {
        return null
      }
      return wx.getStorageSync(key)
    } catch (error) {
      console.error('获取缓存失败:', error)
      return null
    }
  }

  // 设置缓存数据
  private setCachedData(key: string, data: any) {
    try {
      wx.setStorageSync(key, data)
      wx.setStorageSync(CACHE_KEYS.CACHE_TIME, Date.now())
    } catch (error) {
      console.error('设置缓存失败:', error)
    }
  }

  // 处理图片URL
  private processImageUrl(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}) {
    const { width, height, quality = 80 } = options
    let processedUrl = url

    // 如果是相对路径,添加基础URL
    if (!url.startsWith('http')) {
      processedUrl = `${this.imageBaseUrl}/${url}`
    }

    // 添加图片处理参数
    const params = new URLSearchParams()
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('q', quality.toString())

    return `${processedUrl}?${params.toString()}`
  }

  // 搜索壁纸
  async searchWallpapers(params: {
    keyword: string;
    page: number;
    sort?: string;
    time?: string;
    ratio?: string;
  }) {
    const cacheKey = `${CACHE_KEYS.SEARCH_RESULTS}_${JSON.stringify(params)}`
    const cachedData = this.getCachedData<{
      list: IWallpaper[];
      hasMore: boolean;
    }>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await wx.request({
        url: `${this.baseUrl}/wallpapers/search`,
        method: 'GET',
        data: params
      })

      if (response.statusCode !== 200) {
        throw new Error('搜索失败')
      }

      const data = response.data as {
        list: IWallpaper[];
        hasMore: boolean;
      }

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

      // 缓存结果
      this.setCachedData(cacheKey, data)

      return data
    } catch (error: any) {
      console.error('搜索壁纸失败:', error)
      throw new Error(error.message || '搜索失败,请稍后重试')
    }
  }

  // 获取相似壁纸
  async getSimilarWallpapers(id: number) {
    const cacheKey = `similar_wallpapers_${id}`
    const cachedData = this.getCachedData<IWallpaper[]>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await wx.request({
        url: `${this.baseUrl}/wallpapers/${id}/similar`,
        method: 'GET'
      })

      if (response.statusCode !== 200) {
        throw new Error('获取相似壁纸失败')
      }

      const data = response.data as IWallpaper[]

      // 处理图片URL
      const processedData = data.map(item => ({
        ...item,
        url: this.processImageUrl(item.url),
        thumbnail: this.processImageUrl(item.thumbnail, {
          width: 300,
          height: 400,
          quality: 75
        })
      }))

      // 缓存结果
      this.setCachedData(cacheKey, processedData)

      return processedData
    } catch (error: any) {
      console.error('获取相似壁纸失败:', error)
      throw new Error(error.message || '获取相似壁纸失败,请稍后重试')
    }
  }

  // 获取壁纸标签
  async getWallpaperTags(id: number) {
    const cacheKey = `wallpaper_tags_${id}`
    const cachedData = this.getCachedData<string[]>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    try {
      const response = await wx.request({
        url: `${this.baseUrl}/wallpapers/${id}/tags`,
        method: 'GET'
      })

      if (response.statusCode !== 200) {
        throw new Error('获取标签失败')
      }

      const data = response.data as string[]

      // 缓存结果
      this.setCachedData(cacheKey, data)

      return data
    } catch (error: any) {
      console.error('获取壁纸标签失败:', error)
      throw new Error(error.message || '获取标签失败,请稍后重试')
    }
  }
} 