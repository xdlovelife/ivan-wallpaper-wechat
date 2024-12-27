/// <reference path="wx/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

// 壁纸类型
interface IWallpaper {
  id: number
  title: string
  url: string
  thumbnail: string
  width: number
  height: number
  category_id: number
  views: number
  downloads: number
  likes: number
}
