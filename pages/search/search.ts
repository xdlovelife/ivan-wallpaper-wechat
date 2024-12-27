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
  error: string;
  keyword: string;
  page: number;
  hasMore: boolean;
  history: string[];
  hotKeywords: string[];
  filters: {
    sort: 'latest' | 'popular' | 'downloads';
    time: 'all' | 'day' | 'week' | 'month';
    ratio: 'all' | '169' | '189' | '219';
  };
  showFilter: boolean;
}

Page<IPageData>({
  data: {
    list: [],
    loading: false,
    error: '',
    keyword: '',
    page: 1,
    hasMore: true,
    history: [],
    hotKeywords: [
      '动漫', '风景', '美食', '游戏', 
      '萌宠', '汽车', '科技', '艺术'
    ],
    filters: {
      sort: 'latest',
      time: 'all',
      ratio: 'all'
    },
    showFilter: false
  },

  onLoad() {
    this.loadHistory()
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync('search_history') || []
      this.setData({ history })
    } catch (error) {
      console.error('获取搜索历史失败:', error)
    }
  },

  async onSearch() {
    if (!this.data.keyword.trim()) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none'
      })
      return
    }

    // 保存搜索历史
    const history = new Set([
      this.data.keyword,
      ...this.data.history
    ])
    const newHistory = Array.from(history).slice(0, 10)
    
    wx.setStorageSync('search_history', newHistory)
    this.setData({ 
      history: newHistory,
      page: 1,
      list: [],
      hasMore: true
    })
    
    this.loadData()
  },

  async loadData(refresh = false) {
    if (!refresh && (!this.data.hasMore || this.data.loading)) return
    
    this.setData({ 
      loading: true,
      error: ''
    })

    try {
      const { keyword, filters, page } = this.data
      const data = await api.searchWallpapers({
        keyword,
        page: refresh ? 1 : page,
        ...filters
      })
      
      this.setData({
        list: refresh ? data.list : [...this.data.list, ...data.list],
        page: refresh ? 2 : this.data.page + 1,
        hasMore: data.hasMore
      })
    } catch (error: any) {
      console.error('搜索壁纸失败:', error)
      this.setData({ 
        error: error.message || '搜索失败，请稍后重试'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onKeywordInput(e: WechatMiniprogram.Input) {
    this.setData({
      keyword: e.detail.value
    })
  },

  onKeywordClear() {
    this.setData({
      keyword: '',
      list: []
    })
  },

  onHistoryTap(e: WechatMiniprogram.TouchEvent) {
    const { keyword } = e.currentTarget.dataset
    this.setData({
      keyword,
      page: 1,
      list: [],
      hasMore: true
    }, () => {
      this.loadData()
    })
  },

  onHistoryClear() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('search_history')
          this.setData({ history: [] })
        }
      }
    })
  },

  onFilterTap() {
    this.setData({
      showFilter: true
    })
  },

  onFilterClose() {
    this.setData({
      showFilter: false
    })
  },

  onFilterChange(e: WechatMiniprogram.TouchEvent) {
    const { type, value } = e.currentTarget.dataset
    
    this.setData({
      [`filters.${type}`]: value,
      page: 1,
      list: [],
      hasMore: true
    }, () => {
      this.loadData()
    })
  },

  onWallpaperTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    
    wx.navigateTo({
      url: `/pages/wallpaper/detail?id=${id}`
    })
  },

  onReachBottom() {
    this.loadData()
  },

  onShareAppMessage() {
    return {
      title: '发现精美壁纸，快来看看吧',
      path: '/pages/search/search'
    }
  }
}) 