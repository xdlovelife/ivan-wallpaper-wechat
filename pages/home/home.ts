import { api } from '../../services/api'

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

interface IPageData {
  list: IWallpaper[]
  loading: boolean
  refreshing: boolean
  page: number
  hasMore: boolean
  error: string
}

type IPageCustom = WechatMiniprogram.Page.CustomOption

Page<IPageData, IPageCustom>({
  data: {
    list: [],
    loading: false,
    refreshing: false,
    page: 1,
    hasMore: true,
    error: ''
  },

  onLoad() {
    this.loadData()
  },

  async loadData(refresh = false) {
    if (!refresh && (!this.data.hasMore || this.data.loading)) return
    
    this.setData({ 
      loading: true,
      error: ''
    })

    try {
      const data = await api.getWallpapers({
        page: refresh ? 1 : this.data.page
      })
      
      this.setData({
        list: refresh ? data.list : [...this.data.list, ...data.list],
        page: refresh ? 2 : this.data.page + 1,
        hasMore: data.hasMore
      })
    } catch (error: any) {
      console.error('加载数据失败:', error)
      this.setData({ 
        error: error.message || '加载失败，请稍后重试'
      })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ 
        loading: false,
        refreshing: false
      })
    }
  },

  onReachBottom() {
    if (this.data.error) {
      this.loadData(true)
    } else {
      this.loadData()
    }
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true })
    this.loadData(true).finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  onTapWallpaper(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    
    wx.navigateTo({
      url: `/pages/wallpaper/detail?id=${id}`
    })
  },

  onShareAppMessage() {
    return {
      title: '精选壁纸',
      path: '/pages/home/home'
    }
  },

  onShareTimeline() {
    return {
      title: '精选壁纸'
    }
  }
}) 