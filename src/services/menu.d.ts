import { TableListItem as PermissionTableListItem } from '@/services/permission.d';
import { TableListItem as RoleTableListItem } from '@/services/role.d';

// 列表内容结构以及表单提交结构
export interface TableListItem {
  id: string; // 自增id
  name: string; // 名称
  path: ?string; // 路径
  roles?: RoleTableListItem[]; // 角色
  permissions?: PermissionTableListItem[]; // 权限
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
  username?: string; // 账号
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
}
