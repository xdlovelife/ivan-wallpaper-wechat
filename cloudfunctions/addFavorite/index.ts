import * as cloud from 'wx-server-sdk'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

export async function main(event: any) {
  const { wallpaperId } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 检查是否已收藏
    const { total } = await db.collection('favorites')
      .where({
        userId: wxContext.OPENID,
        wallpaperId
      })
      .count()
    
    if (total > 0) {
      return {
        code: 1,
        message: '已经收藏过了'
      }
    }
    
    // 添加收藏
    await db.collection('favorites').add({
      data: {
        userId: wxContext.OPENID,
        wallpaperId,
        createTime: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '收藏成功'
    }
  } catch (error) {
    console.error('收藏失败:', error)
    throw error
  }
} 