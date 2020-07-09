import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/role.d';

export async function queryRole(params?: TableListParams) {
  return request<API.response<API.paginData<TableListItem>>>('/api/role/query', {
    params,
  });
}

export async function showRole(params?: TableListParams) {
  return request<API.response>('/api/role/show', {
    params,
  });
}

export async function removeRole(params: { id: string[] }) {
  return request('/api/role/remove', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function createRole(params: TableListItem) {
  return request<API.response>('/api/role/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRole(params: TableListItem) {
  return request<API.response>('/api/role/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
