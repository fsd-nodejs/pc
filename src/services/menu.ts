import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/menu.d';

export async function queryMenu(params?: TableListParams) {
  return request<API.Response<API.PagingData<TableListItem>>>('/api/menu/query', {
    params,
  });
}

export async function showMenu(params?: TableListParams) {
  return request<API.Response<TableListItem>>('/api/menu/show', {
    params,
  });
}

export async function removeMenu(params: { id: string[] }) {
  return request('/api/menu/remove', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function createMenu(params: TableListItem) {
  return request<API.Response>('/api/menu/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params: TableListItem) {
  return request<API.Response>('/api/menu/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function orderMenu(params: { orders: { id: string; parentId: string }[] }) {
  return request<API.Response>('/api/menu/order', {
    method: 'PATCH',
    data: {
      ...params,
    },
  });
}
