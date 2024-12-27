import { api } from '../../services/api'
import { ICategory } from '../../types/category'
import { ErrorHandler } from '../../utils/error'

Page({
  data: {
    // 分类列表
    list: [] as ICategory[],
    // 搜索关键词
    keyword: '',
    // 是否正在加载
    loading: false,
    // 是否正在刷新
    isRefreshing: false
  },

  onLoad() {
    this.loadData()
  },

  // 加载分类数据
  async loadData(refresh = false) {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      const list = await api.getCategories({
        keyword: this.data.keyword
      })

      this.setData({ list })
    } catch (error) {
      ErrorHandler.showError('加载分类失败')
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

  // 点击分类
  onCategoryTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/wallpaper/list?category=${id}`
    })
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ isRefreshing: true })
    this.loadData(true)
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '壁纸分类',
      path: '/pages/category/category'
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '壁纸分类'
    }
  }
}) 