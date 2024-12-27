declare global {
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
    order: number;
    description?: string;
  }

  interface IUser {
    _id: string;
    nickName: string;
    avatarUrl: string;
  }

  interface IFavorite {
    _id: string;
    userId: string;
    wallpaperId: string;
    createTime: number;
  }

  interface IDownload {
    _id: string;
    userId: string;
    wallpaperId: string;
    createTime: number;
  }

  interface IApiResponse<T> {
    code: number;
    data: T;
    message: string;
  }

  interface IListResponse<T> {
    list: T[];
    total: number;
    hasMore: boolean;
  }
}

export {} 