import * as cloud from 'wx-server-sdk'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

export async function main(event: any) {
  const { wallpaperId } = event
  const wxContext = cloud.getWXContext()
  
  try {
    await db.collection('favorites')
      .where({
        userId: wxContext.OPENID,
        wallpaperId
      })
      .remove()
    
    return {
      code: 0,
      message: '取消收藏成功'
    }
  } catch (error) {
    console.error('取消收藏失败:', error)
    throw error
  }
} 