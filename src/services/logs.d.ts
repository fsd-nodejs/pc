// 列表内容结构以及表单提交结构
export interface TableListItem {
  id: string; // 自增id
  name: string; // 名称
  method: string[]; // 请求方式
  path: string; // 请求路径
  ip?: string; // 描述
  input?: string; // 输入
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
  method?: string; // 请求方式
  path?: string; // 请求路径
  ip?: string; // 描述
  sorter?: string; // 排序
  pageSize?: number;
  currentPage?: number;
}
