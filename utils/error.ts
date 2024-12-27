// 错误类型
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  AUTH = 'AUTH',
  PARAMS = 'PARAMS',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN'
}

// 错误信息
export interface IErrorMessage {
  type: ErrorType;
  code: string;
  message: string;
  details?: any;
}

// 错误处理类
export class ErrorHandler {
  // 处理网络错误
  static handleNetworkError(error: any): IErrorMessage {
    return {
      type: ErrorType.NETWORK,
      code: 'NETWORK_ERROR',
      message: '网络连接失败,请检查网络设置',
      details: error
    }
  }

  // 处理API错误
  static handleApiError(error: any): IErrorMessage {
    return {
      type: ErrorType.API,
      code: 'API_ERROR',
      message: error.message || '服务器响应错误,请稍后重试',
      details: error
    }
  }

  // 处理认证错误
  static handleAuthError(error: any): IErrorMessage {
    return {
      type: ErrorType.AUTH,
      code: 'AUTH_ERROR',
      message: '登录已过期,请重新登录',
      details: error
    }
  }

  // 处理参数错误
  static handleParamsError(error: any): IErrorMessage {
    return {
      type: ErrorType.PARAMS,
      code: 'PARAMS_ERROR',
      message: '参数错误,请检查输入',
      details: error
    }
  }

  // 处理存储错误
  static handleStorageError(error: any): IErrorMessage {
    return {
      type: ErrorType.STORAGE,
      code: 'STORAGE_ERROR',
      message: '本地存储操作失败',
      details: error
    }
  }

  // 处理未知错误
  static handleUnknownError(error: any): IErrorMessage {
    return {
      type: ErrorType.UNKNOWN,
      code: 'UNKNOWN_ERROR',
      message: '发生未知错误,请稍后重试',
      details: error
    }
  }

  // 显示错误提示
  static showError(error: IErrorMessage) {
    wx.showToast({
      title: error.message,
      icon: 'none',
      duration: 2000
    })
  }

  // 记录错误日志
  static logError(error: IErrorMessage) {
    console.error('[Error]', {
      type: error.type,
      code: error.code,
      message: error.message,
      details: error.details,
      time: new Date().toISOString()
    })
  }
} 