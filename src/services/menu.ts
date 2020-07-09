import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/menu.d';

export async function queryMenu(params?: TableListParams) {
  return request<API.response<API.paginData<TableListItem>>>('/api/menu/query', {
    params,
  });
}

export async function showMenu(params?: TableListParams) {
  return request<API.response<TableListItem>>('/api/menu/show', {
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
  return request<API.response>('/api/menu/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params: TableListItem) {
  return request<API.response>('/api/menu/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
