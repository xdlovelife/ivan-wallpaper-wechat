import { IWallpaper } from '../types/wallpaper'

// 预加载配置
interface IPreloadConfig {
  // 预加载数量
  count: number;
  // 预加载距离(px)
  distance: number;
  // 预加载优先级
  priority: 'low' | 'normal' | 'high';
}

export class PerformanceOptimizer {
  // 默认预加载配置
  private static defaultPreloadConfig: IPreloadConfig = {
    count: 10,
    distance: 1000,
    priority: 'normal'
  }

  // 预加载图片
  static preloadImages(images: string[], config = this.defaultPreloadConfig) {
    const { count, priority } = config

    // 限制预加载数量
    const imagesToLoad = images.slice(0, count)

    // 创建图片对象并加载
    imagesToLoad.forEach(src => {
      const image = new Image()
      image.src = src
    })
  }

  // 预加载下一页数据
  static preloadNextPage(currentPage: number, getNextPage: () => Promise<any>) {
    let isLoading = false
    let timer: number

    return () => {
      if (isLoading) return

      // 防抖
      if (timer) clearTimeout(timer)
      timer = setTimeout(async () => {
        isLoading = true
        try {
          await getNextPage()
        } finally {
          isLoading = false
        }
      }, 300)
    }
  }

  // 优化列表渲染
  static optimizeListRendering<T>(list: T[], pageSize = 20): T[][] {
    const pages: T[][] = []
    for (let i = 0; i < list.length; i += pageSize) {
      pages.push(list.slice(i, i + pageSize))
    }
    return pages
  }

  // 图片懒加载
  static setupLazyLoading(selector: string, options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            img.src = src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    }, options)

    // 观察所有图片
    const images = document.querySelectorAll(selector)
    images.forEach(img => observer.observe(img))

    return observer
  }

  // 缓存管理
  static manageCacheSize(maxSize = 50 * 1024 * 1024) { // 默认50MB
    try {
      const keys = wx.getStorageInfoSync().keys
      const keysToRemove: string[] = []
      let totalSize = 0

      // 计算缓存大小
      keys.forEach(key => {
        const value = wx.getStorageSync(key)
        const size = new Blob([JSON.stringify(value)]).size
        totalSize += size

        if (totalSize > maxSize) {
          keysToRemove.push(key)
        }
      })

      // 删除超出大小的缓存
      keysToRemove.forEach(key => {
        wx.removeStorageSync(key)
      })
    } catch (error) {
      console.error('缓存管理失败:', error)
    }
  }

  // 防抖函数
  static debounce(func: Function, wait = 300) {
    let timeout: number | null = null
    
    return function(...args: any[]) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(this, args)
        timeout = null
      }, wait)
    }
  }

  // 节流函数
  static throttle(func: Function, limit = 300) {
    let inThrottle = false
    
    return function(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // 优化大列表性能
  static optimizeLongList(list: any[], config = {
    pageSize: 20,
    bufferSize: 5,
    itemHeight: 200
  }) {
    const { pageSize, bufferSize, itemHeight } = config
    const totalHeight = list.length * itemHeight
    let startIndex = 0
    let visibleCount = pageSize

    return {
      // 获取可见项
      getVisibleItems(scrollTop: number) {
        startIndex = Math.floor(scrollTop / itemHeight)
        startIndex = Math.max(0, startIndex - bufferSize)
        
        const endIndex = Math.min(
          list.length,
          startIndex + visibleCount + bufferSize * 2
        )

        return {
          items: list.slice(startIndex, endIndex),
          startIndex,
          topHeight: startIndex * itemHeight,
          bottomHeight: (list.length - endIndex) * itemHeight
        }
      },

      // 更新配置
      updateConfig(newConfig: Partial<typeof config>) {
        Object.assign(config, newConfig)
        visibleCount = Math.ceil(wx.getSystemInfoSync().windowHeight / itemHeight)
      }
    }
  }
} 