import * as cloud from 'wx-server-sdk'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

export async function main() {
  try {
    const { data } = await db.collection('categories')
      .orderBy('order', 'asc')
      .get()
    
    return {
      list: data,
      total: data.length,
      hasMore: false
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    throw error
  }
} 