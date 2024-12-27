import { ErrorHandler } from '../utils/error'
import { IWallpaper } from '../types/wallpaper'

// 收藏夹
interface ICollection {
  id: string;
  name: string;
  cover?: string;
  wallpapers: number[];
  created_at: string;
  updated_at: string;
}

export class CollectionService {
  // 获取所有收藏夹
  static async getCollections() {
    try {
      const collections = wx.getStorageSync('user_collections') || []
      return collections as ICollection[]
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      return []
    }
  }

  // 创建收藏夹
  static async createCollection(name: string) {
    try {
      const collections = await this.getCollections()
      
      const newCollection: ICollection = {
        id: Date.now().toString(),
        name,
        wallpapers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      collections.push(newCollection)
      wx.setStorageSync('user_collections', collections)

      return newCollection
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 更新收藏夹
  static async updateCollection(id: string, data: Partial<ICollection>) {
    try {
      const collections = await this.getCollections()
      const index = collections.findIndex(c => c.id === id)
      
      if (index === -1) {
        throw new Error('收藏夹不存在')
      }

      collections[index] = {
        ...collections[index],
        ...data,
        updated_at: new Date().toISOString()
      }

      wx.setStorageSync('user_collections', collections)
      return collections[index]
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 删除收藏夹
  static async deleteCollection(id: string) {
    try {
      const collections = await this.getCollections()
      const newCollections = collections.filter(c => c.id !== id)
      wx.setStorageSync('user_collections', newCollections)
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 添加壁纸到收藏夹
  static async addToCollection(collectionId: string, wallpaperId: number) {
    try {
      const collections = await this.getCollections()
      const index = collections.findIndex(c => c.id === collectionId)
      
      if (index === -1) {
        throw new Error('收藏夹不存在')
      }

      if (!collections[index].wallpapers.includes(wallpaperId)) {
        collections[index].wallpapers.push(wallpaperId)
        collections[index].updated_at = new Date().toISOString()
        wx.setStorageSync('user_collections', collections)
      }

      return collections[index]
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 从收藏夹移除壁纸
  static async removeFromCollection(collectionId: string, wallpaperId: number) {
    try {
      const collections = await this.getCollections()
      const index = collections.findIndex(c => c.id === collectionId)
      
      if (index === -1) {
        throw new Error('收藏夹不存在')
      }

      collections[index].wallpapers = collections[index].wallpapers.filter(
        id => id !== wallpaperId
      )
      collections[index].updated_at = new Date().toISOString()
      
      wx.setStorageSync('user_collections', collections)
      return collections[index]
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      throw err
    }
  }

  // 检查壁纸是否在收藏夹中
  static async isInCollection(collectionId: string, wallpaperId: number) {
    try {
      const collections = await this.getCollections()
      const collection = collections.find(c => c.id === collectionId)
      return collection ? collection.wallpapers.includes(wallpaperId) : false
    } catch (error) {
      const err = ErrorHandler.handleStorageError(error)
      ErrorHandler.showError(err)
      return false
    }
  }
} 