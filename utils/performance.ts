import { IWallpaper } from '../types/wallpaper'

// 预加载配置
interface IPreloadConfig {
  count: number;
  distance: number;
  priority: 'low' | 'normal' | 'high';
}

// 列表优化配置
interface IListConfig {
  pageSize: number;
  bufferSize: number;
  itemHeight: number;
}

export class PerformanceOptimizer {
  private static defaultPreloadConfig: IPreloadConfig = {
    count: 10,
    distance: 1000,
    priority: 'normal'
  }

  // 预加载图片
  static preloadImages(images: string[], config = this.defaultPreloadConfig) {
    const { count } = config
    const imagesToLoad = images.slice(0, count)

    return Promise.all(
      imagesToLoad.map(src => {
        return new Promise<void>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = reject
          image.src = src
        })
      })
    )
  }

  // 预加载下一页数据
  static preloadNextPage<T>(
    currentPage: number,
    getNextPage: () => Promise<T>
  ): () => Promise<T | void> {
    let isLoading = false
    let timeoutId: ReturnType<typeof setTimeout>

    return async () => {
      if (isLoading) return

      if (timeoutId) clearTimeout(timeoutId)

      return new Promise<T>((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          isLoading = true
          try {
            const result = await getNextPage()
            resolve(result)
          } catch (error) {
            reject(error)
          } finally {
            isLoading = false
          }
        }, 300)
      })
    }
  }

  // 优化列表渲染
  static optimizeListRendering<T>(list: T[], pageSize = 20): T[][] {
    return Array.from(
      { length: Math.ceil(list.length / pageSize) },
      (_, i) => list.slice(i * pageSize, (i + 1) * pageSize)
    )
  }

  // 图片懒加载
  static setupLazyLoading(selector: string, options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }): IntersectionObserver {
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

    const images = document.querySelectorAll<HTMLImageElement>(selector)
    images.forEach(img => observer.observe(img))

    return observer
  }

  // 缓存管理
  static async manageCacheSize(maxSize = 50 * 1024 * 1024): Promise<void> {
    try {
      const { keys } = wx.getStorageInfoSync()
      const keysToRemove: string[] = []
      let totalSize = 0

      for (const key of keys) {
        const value = wx.getStorageSync(key)
        const size = new Blob([JSON.stringify(value)]).size
        totalSize += size

        if (totalSize > maxSize) {
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach(key => wx.removeStorageSync(key))
    } catch (error) {
      console.error('缓存管理失败:', error)
    }
  }

  // 防抖函数
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait = 300
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        timeoutId = null
      }, wait)
    }
  }

  // 节流函数
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit = 300
  ): (...args: Parameters<T>) => void {
    let inThrottle = false

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // 优化大列表性能
  static optimizeLongList<T>(
    list: T[],
    config: IListConfig = {
      pageSize: 20,
      bufferSize: 5,
      itemHeight: 200
    }
  ) {
    const { pageSize, bufferSize, itemHeight } = config
    let startIndex = 0
    let visibleCount = Math.ceil(
      wx.getSystemInfoSync().windowHeight / itemHeight
    )

    return {
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

      updateConfig(newConfig: Partial<IListConfig>) {
        Object.assign(config, newConfig)
        visibleCount = Math.ceil(
          wx.getSystemInfoSync().windowHeight / itemHeight
        )
      }
    }
  }
} 