import { api } from '../../services/api'
import { IUser } from '../../types/user'
import { ErrorHandler } from '../../utils/error'

// 获取应用实例
const app = getApp()

// 激励广告实例
let videoAd: WechatMiniprogram.RewardedVideoAd | null = null

Page({
  data: {
    // 用户信息
    userInfo: {} as IUser,
    // 收藏数量
    collectSum: 0,
    // 下载数量
    downloadSum: 0,
    // 是否已签到
    isSignIn: false,
    // 是否加载中
    loading: true,
    // 状态栏高度
    statusBarHeight: 0,
    // 版本号
    version: app.globalData.version
  },

  onLoad() {
    // 获取状态栏高度
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight })

    // 初始化广告
    this.initVideoAd()

    // 加载用户数据
    this.loadUserData()
  },

  onShow() {
    // 刷新用户数据
    this.loadUserData()
  },

  // 初始化广告
  initVideoAd() {
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-fe8f45d39a035cca'
      })

      videoAd.onLoad(() => {
        console.log('激励视频广告加载成功')
      })

      videoAd.onError((err) => {
        console.error('激励视频广告加载失败', err)
      })

      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          // 正常播放结束，添加奖励
          this.addPoints(this.data.userInfo.id, '3', 3)
        }
      })
    }
  },

  // 加载用户数据
  async loadUserData() {
    try {
      this.setData({ loading: true })

      // 获取用户信息
      const userInfo = wx.getStorageSync('userInfo')
      const isSignIn = wx.getStorageSync('isSignIn')

      if (userInfo) {
        this.setData({
          userInfo,
          isSignIn,
          loading: false
        })

        // 获取收藏和下载数量
        await this.loadActionCount(userInfo.id)
      }
    } catch (error) {
      ErrorHandler.showError('加载用户数据失败')
    } finally {
      this.setData({ loading: false })
    }
  },

  // 获取收藏和下载数量
  async loadActionCount(uid: string) {
    try {
      const res = await wx.request({
        url: `${app.globalData.baseURL}/manager/v2/wallpaper/wechat/action/count`,
        method: 'POST',
        data: { uid },
        header: {
          'Authorization': this.data.userInfo.accessToken,
          'content-type': 'application/json'
        }
      })

      if (res.statusCode === 200) {
        const { data } = res.data as any
        this.setData({
          collectSum: data.collectSum,
          downloadSum: data.downloadSum
        })
      }
    } catch (error) {
      ErrorHandler.showError('获取统计数据失败')
    }
  },

  // 选择头像
  async onChooseAvatar(e: any) {
    try {
      const { avatarUrl } = e.detail
      const userInfo = { ...this.data.userInfo, avatar: avatarUrl }
      
      await wx.setStorageSync('userInfo', userInfo)
      this.setData({ userInfo })
    } catch (error) {
      ErrorHandler.showError('更新头像失败')
    }
  },

  // 修改昵称
  async onNicknameChange(e: any) {
    try {
      const nickname = e.detail.value.trim()
      if (!nickname) return

      const userInfo = { ...this.data.userInfo, nickname }
      
      await wx.setStorageSync('userInfo', userInfo)
      this.setData({ userInfo })
    } catch (error) {
      ErrorHandler.showError('更新昵称失败')
    }
  },

  // 复制UID
  onCopyUid() {
    wx.setClipboardData({
      data: this.data.userInfo.id,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },

  // 签到
  async onSignIn(e: any) {
    if (this.data.isSignIn) {
      wx.showModal({
        title: '提示',
        content: '今天已经签到过了',
        showCancel: false
      })
      return
    }

    const { uid, operation } = e.currentTarget.dataset
    await this.addPoints(uid, operation, 1)
  },

  // 观看广告
  onMorePoints(e: any) {
    const { uid, operation } = e.currentTarget.dataset

    wx.showModal({
      title: '提示',
      content: '即将播放广告获取青豆',
      success: (res) => {
        if (res.confirm && videoAd) {
          videoAd.show().catch(() => {
            videoAd?.load().then(() => videoAd?.show())
          })
        }
      }
    })
  },

  // 添加积分
  async addPoints(uid: string, operation: string, points: number) {
    try {
      const res = await wx.request({
        url: `${app.globalData.baseURL}/manager/sys/user/point/add`,
        method: 'POST',
        data: {
          uid,
          operation,
          points
        },
        header: {
          'Authorization': this.data.userInfo.accessToken,
          'content-type': 'application/json'
        }
      })

      if (res.statusCode === 200) {
        // 更新用户信息
        const userInfo = {
          ...this.data.userInfo,
          points: this.data.userInfo.points + points
        }
        
        await wx.setStorageSync('userInfo', userInfo)
        if (operation === '1') {
          await wx.setStorageSync('isSignIn', true)
        }

        this.setData({
          userInfo,
          isSignIn: operation === '1' ? true : this.data.isSignIn
        })

        wx.showToast({
          title: `获得${points}青豆`,
          icon: 'success'
        })
      }
    } catch (error) {
      ErrorHandler.showError('添加青豆失败')
    }
  },

  // 前往收藏页
  goCollect() {
    wx.navigateTo({
      url: `/mine_pages/collect/collect?uid=${this.data.userInfo.id}`
    })
  },

  // 前往下载页
  goDownload() {
    wx.navigateTo({
      url: `/mine_pages/download/download?uid=${this.data.userInfo.id}`
    })
  },

  // 前往积分明细
  goRecords() {
    wx.navigateTo({
      url: '/mine_pages/records/records'
    })
  },

  // 意见反馈
  openFeedbackTab() {
    wx.navigateTo({
      url: `/mine_pages/feedback/feedback?uid=${this.data.userInfo.id}`
    })
  },

  // 常见问题
  openCommonProblemsTab() {
    wx.navigateTo({
      url: '/mine_pages/common_problems/common_problems'
    })
  },

  // 关于我们
  openAboutTab() {
    wx.navigateTo({
      url: '/mine_pages/about/about'
    })
  },

  // 清除缓存
  showClearCacheModal() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
        }
      }
    })
  },

  // 分享给好友
  onShareAppMessage() {
    const swiperImages = wx.getStorageSync('swiperImages')
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)]

    // 延迟添加分享奖励
    setTimeout(() => {
      this.addPoints(this.data.userInfo.id, '2', 2)
    }, 3000)

    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    const swiperImages = wx.getStorageSync('swiperImages')
    const randomImage = swiperImages[Math.floor(Math.random() * swiperImages.length)]

    // 延迟添加分享奖励
    setTimeout(() => {
      this.addPoints(this.data.userInfo.id, '2', 2)
    }, 3000)

    return {
      title: app.globalData.shareTitle,
      imageUrl: randomImage.thumbnailFilePath,
      path: '/pages/home/home'
    }
  }
}) 