import { config } from '../config/index'

class CloudService {
  private env: string

  constructor() {
    this.env = config.env
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    wx.cloud.init({
      env: this.env,
      traceUser: true
    })
  }

  // 获取壁纸列表
  async getWallpapers(params: { page: number; categoryId?: string }) {
    return await this.callFunction<ICloudListResponse<IWallpaper>>('getWallpapers', params)
  }

  // 获取分类列表
  async getCategories() {
    return await this.callFunction<ICloudListResponse<ICategory>>('getCategories', {})
  }

  // 收藏壁纸
  async addFavorite(wallpaperId: string) {
    return await this.callFunction('addFavorite', { wallpaperId })
  }

  // 取消收藏
  async removeFavorite(wallpaperId: string) {
    return await this.callFunction('removeFavorite', { wallpaperId })
  }

  // 获取收藏状态
  async getFavoriteStatus(wallpaperIds: string[]) {
    return await this.callFunction<string[]>('getFavoriteStatus', { wallpaperIds })
  }

  // 记录下载历史
  async addDownloadHistory(wallpaperId: string) {
    return await this.callFunction('addDownloadHistory', { wallpaperId })
  }

  private async callFunction<T = any>(name: string, data: any): Promise<T> {
    try {
      const { result } = await wx.cloud.callFunction({
        name,
        data
      })
      return result as T
    } catch (error) {
      console.error(`调用云函数 ${name} 失败:`, error)
      throw error
    }
  }
}

export const cloud = new CloudService() 