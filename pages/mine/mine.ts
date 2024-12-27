import { api } from '../../services/api'

interface IPageData {
  userInfo: {
    uid: string;
    nickname: string;
    avatar: string;
  };
  stats: {
    coins: number;
    collections: number;
    downloads: number;
  };
  loading: boolean;
  error: string;
}

Page<IPageData>({
  data: {
    userInfo: {
      uid: '',
      nickname: '',
      avatar: '/assets/icons/default_avatar.png'
    },
    stats: {
      coins: 0,
      collections: 0,
      downloads: 0
    },
    loading: true,
    error: ''
  },

  onLoad() {
    this.loadUserInfo()
    this.loadUserStats()
  },

  async loadUserInfo() {
    try {
      // 获取用户信息
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({ userInfo })
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  },

  async loadUserStats() {
    this.setData({ loading: true, error: '' })

    try {
      // 获取收藏数量
      const collections = wx.getStorageSync('liked_wallpapers') || []
      
      // 获取下载记录
      const downloads = wx.getStorageSync('downloaded_wallpapers') || []
      
      // 获取青豆数量
      const coins = wx.getStorageSync('user_coins') || 0
      
      this.setData({
        stats: {
          collections: collections.length,
          downloads: downloads.length,
          coins
        }
      })
    } catch (error) {
      console.error('获取用户统计失败:', error)
      this.setData({
        error: '获取数据失败，请稍后重试'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onCollectionsTap() {
    wx.navigateTo({
      url: '/pages/mine/collections'
    })
  },

  onDownloadsTap() {
    wx.navigateTo({
      url: '/pages/mine/downloads'
    })
  },

  onCoinsTap() {
    wx.showModal({
      title: '青豆说明',
      content: '每日签到 +1，分享好友 +2，观看广告 +3',
      showCancel: false
    })
  },

  onDailyCheckIn() {
    wx.showToast({
      title: '签到成功 +1',
      icon: 'success'
    })
    
    const coins = (wx.getStorageSync('user_coins') || 0) + 1
    wx.setStorageSync('user_coins', coins)
    
    this.setData({
      'stats.coins': coins
    })
  },

  onShareFriend() {
    // 分享逻辑在 onShareAppMessage 中处理
  },

  onWatchAd() {
    // 这里添加广告组件逻辑
    wx.showToast({
      title: '观看完成 +3',
      icon: 'success'
    })
    
    const coins = (wx.getStorageSync('user_coins') || 0) + 3
    wx.setStorageSync('user_coins', coins)
    
    this.setData({
      'stats.coins': coins
    })
  },

  onContactService() {
    // 打开客服会话
  },

  onAboutUs() {
    wx.navigateTo({
      url: '/pages/mine/about'
    })
  },

  onShareAppMessage() {
    const coins = (wx.getStorageSync('user_coins') || 0) + 2
    wx.setStorageSync('user_coins', coins)
    
    this.setData({
      'stats.coins': coins
    })
    
    return {
      title: '发现一个超棒的壁纸小程序',
      path: '/pages/home/home',
      imageUrl: '/assets/share_cover.png'
    }
  }
}) 