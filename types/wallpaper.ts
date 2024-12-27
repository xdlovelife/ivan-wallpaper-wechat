// 壁纸基础信息
export interface IWallpaper {
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
  tags?: string[];
  created_at: string;
}

// 壁纸分类
export interface ICategory {
  id: number;
  name: string;
  type: string;
  icon: string;
  order: number;
  count?: number;
}

// 分页数据
export interface IPageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 搜索参数
export interface ISearchParams {
  keyword: string;
  page: number;
  pageSize?: number;
  sort?: 'latest' | 'popular' | 'downloads';
  time?: 'all' | 'day' | 'week' | 'month';
  ratio?: 'all' | '169' | '189' | '219';
  tags?: string[];
}

// 壁纸统计
export interface IWallpaperStats {
  views: number;
  downloads: number;
  likes: number;
}

// 用户收藏
export interface IUserCollection {
  wallpaper_id: number;
  created_at: string;
}

// 下载记录
export interface IDownloadRecord {
  wallpaper_id: number;
  downloaded_at: string;
} 