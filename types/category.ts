// 分类类型
export interface ICategory {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  description?: string;
  parent_id?: string;
  order: number;
  count: number;
  created_at: string;
  updated_at: string;
}

// 分类树节点
export interface ICategoryTreeNode extends ICategory {
  children?: ICategoryTreeNode[];
}

// 分类统计
export interface ICategoryStats {
  total: number;
  device: number;
  subject: number;
  color: number;
} 