import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/permission.d';

export async function queryPermission(params?: TableListParams) {
  return request('/api/permission/query', {
    params,
  });
}

export async function showPermission(params?: TableListParams) {
  return request('/api/permission/show', {
    params,
  });
}

export async function removePermission(params: { id: number[] }) {
  return request('/api/permission/remove', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function createPermission(params: TableListItem) {
  return request('/api/permission/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updatePermission(params: TableListItem) {
  return request('/api/permission/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
