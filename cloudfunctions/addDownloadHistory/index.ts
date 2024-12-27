import * as cloud from 'wx-server-sdk'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

export async function main(event: any) {
  const { wallpaperId } = event
  const wxContext = cloud.getWXContext()
  
  try {
    await db.collection('downloads').add({
      data: {
        userId: wxContext.OPENID,
        wallpaperId,
        createTime: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: '记录下载历史成功'
    }
  } catch (error) {
    console.error('记录下载历史失败:', error)
    throw error
  }
} 