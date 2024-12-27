declare namespace WechatMiniprogram {
  interface Wx {
    // 存储相关
    getStorageSync(key: string): any;
    setStorageSync(key: string, data: any): void;
    removeStorageSync(key: string): void;
    getStorageInfoSync(): {
      keys: string[];
      currentSize: number;
      limitSize: number;
    };

    // 系统信息
    getSystemInfoSync(): {
      windowWidth: number;
      windowHeight: number;
      pixelRatio: number;
      platform: string;
    };

    // 网络请求
    request<T = any>(options: {
      url: string;
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      header?: Record<string, string>;
    }): Promise<{
      data: T;
      statusCode: number;
      header: Record<string, string>;
    }>;

    // 界面交互
    showToast(options: {
      title: string;
      icon?: 'success' | 'error' | 'loading' | 'none';
      duration?: number;
    }): Promise<void>;

    showModal(options: {
      title: string;
      content: string;
      showCancel?: boolean;
    }): Promise<{
      confirm: boolean;
      cancel: boolean;
    }>;
  }
}

declare const wx: WechatMiniprogram.Wx; 