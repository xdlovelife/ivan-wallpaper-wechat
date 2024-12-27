import * as cloud from 'wx-server-sdk'
import { IWallpaper } from './types'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const PAGE_SIZE = 20

interface IEvent {
  page?: number;
  categoryId?: string;
}

export async function main(event: IEvent) {
  const { page = 1, categoryId } = event
  const skip = (page - 1) * PAGE_SIZE
  
  const query = categoryId ? { categoryId } : {}
  
  try {
    const countResult = await db.collection('wallpapers')
      .where(query)
      .count()
    
    const { data } = await db.collection('wallpapers')
      .where(query)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(PAGE_SIZE)
      .get()
    
    return {
      list: data as IWallpaper[],
      total: countResult.total,
      hasMore: skip + data.length < countResult.total
    }
  } catch (error) {
    console.error('获取壁纸列表失败:', error)
    throw error
  }
} 