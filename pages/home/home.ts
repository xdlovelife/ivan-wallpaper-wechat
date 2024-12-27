import { api } from '../../services/api'
import { IWallpaper } from '../../types/wallpaper'
import { ErrorHandler } from '../../utils/error'

Page({
  data: {
    // 壁纸列表
    list: [] as IWallpaper[],
    // 分类列表
    categories: [] as Array<{id: string; name: string}>,
    // 当前选中的分类
    currentCategory: '',
    // 搜索关键词
    keyword: '',
    // 页码
    page: 1,
    // 是否有更多数据
    hasMore: true,
    // 是否正在加载
    loading: false,
    // 是否正在刷新
    isRefreshing: false
  },

  onLoad() {
    this.loadCategories()
    this.loadData()
  },

  // 加载分类
  async loadCategories() {
    try {
      const categories = await api.getCategories()
      this.setData({ categories })
    } catch (error) {
      ErrorHandler.showError('加载分类失败')
    }
  },

  // 加载壁纸数据
  async loadData(refresh = false) {
    if (this.data.loading || (!refresh && !this.data.hasMore)) return

    this.setData({ 
      loading: true,
      page: refresh ? 1 : this.data.page
    })

    try {
      const { list, hasMore } = await api.searchWallpapers({
        keyword: this.data.keyword,
        category: this.data.currentCategory,
        page: this.data.page,
        pageSize: 10
      })

      this.setData({
        list: refresh ? list : [...this.data.list, ...list],
        hasMore,
        page: this.data.page + 1
      })
    } catch (error) {
      ErrorHandler.showError('加载壁纸失败')
    } finally {
      this.setData({ 
        loading: false,
        isRefreshing: false
      })
    }
  },

  // 搜索输入
  onSearchInput(e: WechatMiniprogram.Input) {
    this.setData({
      keyword: e.detail.value.trim()
    })
  },

  // 搜索确认
  onSearch() {
    this.loadData(true)
  },

  // 点击分类标签
  onTagTap(e: WechatMiniprogram.TouchEvent) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentCategory: category
    }, () => {
      this.loadData(true)
    })
  },

  // 点击壁纸
  onWallpaperTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/wallpaper/detail?id=${id}`
    })
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ isRefreshing: true })
    this.loadData(true)
  },

  // 加载更多
  onLoadMore() {
    this.loadData()
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '精选壁纸',
      path: '/pages/home/home'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '精选壁纸'
    }
  }
}) 