import { TableListItem as PermissionTableListItem } from '@/services/permission.d';

// 列表内容结构以及表单提交结构
export interface TableListItem {
  id: string; // 自增id
  name: string; // 名称
  slug: string; // 标识
  permissions: PermissionTableListItem[]; // 权限
  updatedAt?: Date; // 更新时间
  createdAt?: Date; // 创建时间
}

// 分页结构
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

// 列表结构
export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

// 查询参数
export interface TableListParams {
  id?: string; // 自增id
  name?: string; // 名称
  slug?: string; // 标识
  desc?: string; // 描述
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
}
