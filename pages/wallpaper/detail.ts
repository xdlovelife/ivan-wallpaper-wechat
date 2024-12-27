import { api } from '../../services/api'

interface IPageData {
  wallpaper: {
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
    description: string;
  } | null;
  loading: boolean;
  error: string;
  isLiked: boolean;
  showShare: boolean;
}

Page<IPageData>({
  data: {
    wallpaper: null,
    loading: true,
    error: '',
    isLiked: false,
    showShare: false
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadWallpaper(parseInt(id))
    } else {
      this.setData({
        loading: false,
        error: '参数错误'
      })
    }
  },

  async loadWallpaper(id: number) {
    this.setData({ loading: true, error: '' })

    try {
      const wallpaper = await api.getWallpaperDetail(id)
      
      // 更新浏览量
      api.updateWallpaperStats(id, 'view').catch(console.error)
      
      // 检查是否已收藏
      const isLiked = await this.checkIsLiked(id)
      
      this.setData({
        wallpaper,
        isLiked
      })
    } catch (error: any) {
      console.error('加载壁纸详情失败:', error)
      this.setData({
        error: error.message || '加载失败，请稍后重试'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  async checkIsLiked(id: number) {
    try {
      const likedList = wx.getStorageSync('liked_wallpapers') || []
      return likedList.includes(id)
    } catch (e) {
      console.error('检查收藏状态失败:', e)
      return false
    }
  },

  async onLikeTap() {
    if (!this.data.wallpaper) return
    
    const { id } = this.data.wallpaper
    const isLiked = !this.data.isLiked
    
    try {
      // 更新本地存储
      const likedList = wx.getStorageSync('liked_wallpapers') || []
      if (isLiked) {
        likedList.push(id)
      } else {
        const index = likedList.indexOf(id)
        if (index > -1) {
          likedList.splice(index, 1)
        }
      }
      wx.setStorageSync('liked_wallpapers', likedList)
      
      // 更新服务器数据
      await api.updateWallpaperStats(id, 'like')
      
      this.setData({ isLiked })
      
      wx.showToast({
        title: isLiked ? '已收藏' : '已取消收藏',
        icon: 'success'
      })
    } catch (error) {
      console.error('更新收藏状态失败:', error)
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  },

  async onDownloadTap() {
    if (!this.data.wallpaper) return
    
    const { url, id } = this.data.wallpaper
    
    wx.showLoading({
      title: '下载中...'
    })
    
    try {
      // 下载图片
      const { tempFilePath } = await wx.downloadFile({
        url
      })
      
      // 保存到相册
      await wx.saveImageToPhotosAlbum({
        filePath: tempFilePath
      })
      
      // 更新下载量
      api.updateWallpaperStats(id, 'download').catch(console.error)
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    } catch (error: any) {
      console.error('下载失败:', error)
      
      if (error.errMsg.includes('auth deny')) {
        wx.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    } finally {
      wx.hideLoading()
    }
  },

  onPreviewTap() {
    if (!this.data.wallpaper) return
    
    wx.previewImage({
      urls: [this.data.wallpaper.url],
      current: this.data.wallpaper.url
    })
  },

  onShareTap() {
    this.setData({
      showShare: true
    })
  },

  onCloseShare() {
    this.setData({
      showShare: false
    })
  },

  onShareAppMessage() {
    const { wallpaper } = this.data
    if (!wallpaper) return {}
    
    return {
      title: wallpaper.title || '精美壁纸',
      imageUrl: wallpaper.thumbnail,
      path: `/pages/wallpaper/detail?id=${wallpaper.id}`
    }
  },

  onShareTimeline() {
    const { wallpaper } = this.data
    if (!wallpaper) return {}
    
    return {
      title: wallpaper.title || '精美壁纸',
      imageUrl: wallpaper.thumbnail,
      query: `id=${wallpaper.id}`
    }
  }
}) 