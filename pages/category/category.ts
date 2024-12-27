import { api } from '../../services/api'

interface ICategory {
  id: number;
  name: string;
  name_en: string;
  cover_url: string | null;
  icon_url: string | null;
  type: 'device' | 'subject' | 'color';
  description: string | null;
  order: number;
  count: number;
}

type GroupedCategories = {
  device: ICategory[];
  subject: ICategory[];
  color: ICategory[];
}

interface IPageData {
  categories: GroupedCategories;
  loading: boolean;
  refreshing: boolean;
  error: string;
  activeTab: keyof GroupedCategories;
}

Page<IPageData>({
  data: {
    categories: {
      device: [],
      subject: [],
      color: []
    },
    loading: false,
    refreshing: false,
    error: '',
    activeTab: 'device'
  },

  onLoad() {
    this.loadCategories()
  },

  async loadCategories(useCache = true) {
    if (this.data.loading) return
    
    this.setData({ 
      loading: true,
      error: ''
    })

    try {
      const categories = await api.getCategories()
      
      // 缓存数据
      wx.setStorage({
        key: 'categories',
        data: categories
      })
      
      this.setData({ categories })
    } catch (error: any) {
      console.error('加载分类失败:', error)
      
      // 尝试使用缓存
      if (useCache) {
        try {
          const cache = wx.getStorageSync('categories')
          if (cache) {
            this.setData({ categories: cache })
            return
          }
        } catch (e) {
          console.error('读取缓存失败:', e)
        }
      }
      
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

  onTabChange(e: WechatMiniprogram.TouchEvent) {
    const { type } = e.currentTarget.dataset
    if (!type || type === this.data.activeTab) return
    
    this.setData({
      activeTab: type
    })
  },

  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const { id, type, name } = e.currentTarget.dataset
    if (!id || !type) return
    
    wx.navigateTo({
      url: `/pages/wallpaper/list?categoryId=${id}&type=${type}&title=${name || '分类壁纸'}`
    })
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true })
    this.loadCategories(false).finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  onShareAppMessage() {
    return {
      title: '发现精美壁纸，快来看看吧',
      path: '/pages/category/category'
    }
  },

  onShareTimeline() {
    return {
      title: '发现精美壁纸'
    }
  }
}) 