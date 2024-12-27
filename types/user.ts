// 用户类型
export interface IUser {
  id: number;
  nickname: string;
  avatar: string;
  gender: 0 | 1 | 2;
  coins: number;
  vip_level: number;
  vip_expired_at?: string;
  created_at: string;
  updated_at: string;
}

// 用户统计
export interface IUserStats {
  collections: number;
  downloads: number;
  likes: number;
  coins: number;
}

// 用户收藏
export interface IUserCollection {
  id: number;
  user_id: number;
  wallpaper_id: number;
  created_at: string;
}

// 用户下载
export interface IUserDownload {
  id: number;
  user_id: number;
  wallpaper_id: number;
  created_at: string;
}

// 用户点赞
export interface IUserLike {
  id: number;
  user_id: number;
  wallpaper_id: number;
  created_at: string;
}

// 用户签到
export interface IUserCheckin {
  id: number;
  user_id: number;
  days: number;
  coins: number;
  created_at: string;
}

// 用户任务
export interface IUserTask {
  id: number;
  user_id: number;
  task_id: number;
  status: 'pending' | 'completed' | 'expired';
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// 用户设置
export interface IUserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  notification: boolean;
  auto_play: boolean;
} 