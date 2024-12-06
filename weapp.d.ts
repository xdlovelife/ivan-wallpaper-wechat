// weapp.d.ts
declare namespace wx {
  interface PageOptions {
    data?: Record<string, any>;
    onLoad?: () => void;
    onPullDownRefresh?: () => void;
    onReachBottom?: () => void;
    [key: string]: any;
  }

  interface Page {
    new (options: PageOptions): void;
  }

  interface RequestConfig {
    url: string;
    method?: string;
    data?: Record<string, any> | string | ArrayBuffer;
    header?: Record<string, string>;
    success?: (res: RequestSuccessCallbackResult) => void;
    fail?: (err: RequestFailCallbackResult) => void;
    [key: string]: any;
  }

  interface RequestSuccessCallbackResult {
    statusCode: number;
    data: any;
    [key: string]: any;
  }

  interface RequestFailCallbackResult {
    errMsg: string;
    [key: string]: any;
  }

  interface ShowLoadingOptions {
    title: string;
    [key: string]: any;
  }

  interface HideLoadingOptions {
    [key: string]: any;
  }

  interface ScrollEventDetail {
    detail: {
      scrollTop: number;
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface TapEvent {
    currentTarget: {
      dataset: {
        item: {
          filePath: string;
        };
      };
    };
  }

  interface NavigateToOptions {
    url: string;
    [key: string]: any;
  }

  function Page(options: PageOptions): void;
  function request(config: RequestConfig): void;
  function showLoading(options: ShowLoadingOptions): void;
  function hideLoading(options?: HideLoadingOptions): void;
  function stopPullDownRefresh(): void;
  function navigateTo(options: NavigateToOptions): void;
}

// 移除 declare var wx: wx; 以避免重复定义