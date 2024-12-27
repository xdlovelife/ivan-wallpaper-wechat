// 错误类型
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN'
}

// 错误信息
interface IError {
  type: ErrorType;
  code?: number;
  message: string;
  details?: any;
}

export class ErrorHandler {
  // 处理网络错误
  static handleNetworkError(error: any): IError {
    return {
      type: ErrorType.NETWORK,
      message: '网络连接失败，请检查网络设置',
      details: error
    }
  }

  // 处理API错误
  static handleApiError(error: any): IError {
    return {
      type: ErrorType.API,
      code: error.code,
      message: error.message || '服务器错误，请稍后重试',
      details: error
    }
  }

  // 处理存储错误
  static handleStorageError(error: any): IError {
    return {
      type: ErrorType.STORAGE,
      message: '存储操作失败',
      details: error
    }
  }

  // 处理未知错误
  static handleUnknownError(error: any): IError {
    return {
      type: ErrorType.UNKNOWN,
      message: '未知错误，请稍后重试',
      details: error
    }
  }

  // 显示错误提示
  static showError(message: string) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  }

  // 记录错误日志
  static logError(error: IError) {
    console.error('[Error]', {
      type: error.type,
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString()
    })
  }

  // 上报错误
  static reportError(error: IError) {
    // TODO: 实现错误上报逻辑
    console.warn('Error reporting not implemented:', error)
  }
} 