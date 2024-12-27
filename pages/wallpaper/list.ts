import { api } from '../../services/api'

interface IWallpaper {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  category_id: number;
  views: number;
  downloads: number;
  likes: number;
}

interface IPageData {
  list: IWallpaper[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  page: number;
  hasMore: boolean;
  categoryId?: number;
  categoryName: string;
}

Page<IPageData>({
  data: {
    list: [],
    loading: false,
    refreshing: false,
    error: '',
    page: 1,
    hasMore: true,
    categoryName: '壁纸'
  },

  onLoad(options) {
    const { categoryId, title } = options
    
    if (categoryId) {
      this.setData({ 
        categoryId: parseInt(categoryId),
        categoryName: title || '壁纸'
      })
      
      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: title || '壁纸'
      })
    }
    
    this.loadData()
  },

  async loadData(refresh = false) {
    if (!refresh && (!this.data.hasMore || this.data.loading)) return
    
    this.setData({ 
      loading: true,
      error: ''
    })

    try {
      const { categoryId } = this.data
      const data = await api.getWallpapers({
        page: refresh ? 1 : this.data.page,
        categoryId
      })
      
      this.setData({
        list: refresh ? data.list : [...this.data.list, ...data.list],
        page: refresh ? 2 : this.data.page + 1,
        hasMore: data.hasMore
      })
    } catch (error: any) {
      console.error('加载壁纸列表失败:', error)
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

  onWallpaperTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    
    wx.navigateTo({
      url: `/pages/wallpaper/detail?id=${id}`
    })
  },

  onShareAppMessage() {
    const { categoryId, categoryName } = this.data
    return {
      title: `${categoryName}壁纸`,
      path: categoryId 
        ? `/pages/wallpaper/list?categoryId=${categoryId}&title=${categoryName}`
        : '/pages/wallpaper/list'
    }
  },

  onShareTimeline() {
    const { categoryId, categoryName } = this.data
    return {
      title: `${categoryName}壁纸`,
      query: categoryId 
        ? `categoryId=${categoryId}&title=${categoryName}`
        : ''
    }
  }
}) 