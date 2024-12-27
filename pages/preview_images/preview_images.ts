interface IWallpaper {
  id: string;
  thumbUrl: string;
  originUrl: string;
  isFavorite: boolean;
}

type PageDataType = {
  list: IWallpaper[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  categoryId: string;
}

Page<PageDataType, PageCustomOption>({
  data: {
    list: [],
    loading: false,
    page: 1,
    hasMore: true,
    categoryId: ''
  },

  onLoad(options) {
    if (options.categoryId) {
      this.setData({ categoryId: options.categoryId })
      this.loadData()
    }
  },

  async loadData() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'getWallpapers',
        data: { 
          categoryId: this.data.categoryId,
          page: this.data.page 
        }
      }) as unknown as ICloudFunctionResponse

      // 获取收藏状态
      const favorites = await this.getFavorites(res.result.data.map(item => item.id))
      const list = res.result.data.map(item => ({
        ...item,
        isFavorite: favorites.includes(item.id)
      }))
      
      this.setData({
        list: [...this.data.list, ...list],
        page: this.data.page + 1,
        hasMore: res.result.hasMore
      })
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  async getFavorites(ids: string[]) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getFavorites',
        data: { ids }
      }) as unknown as { result: { data: string[] } }
      return res.result.data
    } catch (error) {
      console.error('获取收藏状态失败:', error)
      return []
    }
  },

  onImageTap(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const urls = this.data.list.map(item => item.originUrl)
    wx.previewImage({
      urls,
      current: urls[index]
    })
  },

  async onFavoriteTap(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    const item = this.data.list.find(item => item.id === id)
    if (!item) return

    try {
      await wx.cloud.callFunction({
        name: item.isFavorite ? 'removeFavorite' : 'addFavorite',
        data: { id }
      })

      const list = this.data.list.map(item => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite }
        }
        return item
      })
      
      this.setData({ list })
    } catch (error) {
      console.error('操作收藏失败:', error)
    }
  },

  async onDownloadTap(e: WechatMiniprogram.TouchEvent) {
    const { url, id } = e.currentTarget.dataset
    
    wx.showLoading({ title: '下载中...' })
    try {
      const { tempFilePath } = await wx.downloadFile({ url })
      await wx.saveImageToPhotosAlbum({ filePath: tempFilePath })
      
      // 记录下载历史
      await wx.cloud.callFunction({
        name: 'addDownloadHistory',
        data: { id }
      })
      
      wx.showToast({ title: '保存成功' })
    } catch (error) {
      console.error('下载失败:', error)
      wx.showToast({ 
        title: '保存失败', 
        icon: 'error' 
      })
    } finally {
      wx.hideLoading()
    }
  },

  onReachBottom() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.setData({
      list: [],
      page: 1,
      hasMore: true
    }, () => {
      this.loadData().then(() => {
        wx.stopPullDownRefresh()
      })
    })
  },

  onShareAppMessage() {
    return {
      title: '发现一组超棒的壁纸，快来看看吧',
      path: `/pages/preview_images/preview_images?categoryId=${this.data.categoryId}`
    }
  }
}) 