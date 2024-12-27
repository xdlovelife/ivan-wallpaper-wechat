// 壁纸类型
export interface IWallpaper {
  id: number;
  title: string;
  description?: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  size: number;
  format: string;
  category_id: number;
  tags: string[];
  views: number;
  downloads: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// 搜索参数
export interface ISearchParams {
  keyword?: string;
  category?: string;
  tags?: string[];
  sort?: 'latest' | 'popular' | 'downloads' | 'likes';
  page?: number;
  pageSize?: number;
}

// 壁纸详情
export interface IWallpaperDetail extends IWallpaper {
  author?: {
    id: number;
    name: string;
    avatar: string;
  };
  related?: IWallpaper[];
  is_liked?: boolean;
  is_collected?: boolean;
}

// 壁纸统计
export interface IWallpaperStats {
  total: number;
  today: number;
  week: number;
  month: number;
} 