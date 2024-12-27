export interface IWallpaper {
  _id: string;
  url: string;
  thumbUrl: string;
  categoryId: string;
  createTime: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  coverUrl: string;
  count: number;
  order: number;
  description?: string;
}

export interface IFavorite {
  _id: string;
  userId: string;
  wallpaperId: string;
  createTime: Date;
}

export interface IDownload {
  _id: string;
  userId: string;
  wallpaperId: string;
  createTime: Date;
} 