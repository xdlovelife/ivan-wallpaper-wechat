interface IWallpaper {
  _id: string;
  url: string;
  thumbUrl: string;
  categoryId: string;
  createTime: number;
}

interface ICategory {
  _id: string;
  name: string;
  coverUrl: string;
  count: number;
  description?: string;
}

interface ICloudResponse<T> {
  code: number;
  data: T;
  message: string;
}

interface ICloudListResponse<T> {
  list: T[];
  total: number;
  hasMore: boolean;
} 