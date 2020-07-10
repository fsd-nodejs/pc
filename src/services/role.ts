import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/role.d';

export async function queryRole(params?: TableListParams) {
  return request<API.Response<API.PagingData<TableListItem>>>('/api/role/query', {
    params,
  });
}

export async function showRole(params?: TableListParams) {
  return request<API.Response<TableListItem>>('/api/role/show', {
    params,
  });
}

export async function removeRole(params: { id: string[] }) {
  return request<API.Response>('/api/role/remove', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function createRole(params: TableListItem) {
  return request<API.Response>('/api/role/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRole(params: TableListItem) {
  return request<API.Response>('/api/role/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
