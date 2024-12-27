import * as cloud from 'wx-server-sdk'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

export async function main(event: any) {
  const { wallpaperIds } = event
  const wxContext = cloud.getWXContext()
  
  try {
    const { data } = await db.collection('favorites')
      .where({
        userId: wxContext.OPENID,
        wallpaperId: _.in(wallpaperIds)
      })
      .get()
    
    return data.map(item => item.wallpaperId)
  } catch (error) {
    console.error('获取收藏状态失败:', error)
    throw error
  }
} 