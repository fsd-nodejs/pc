import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/permission.d';

export async function queryPermission(params?: TableListParams) {
  return request('/api/permission/query', {
    params,
  });
}

export async function removePermission(params: { key: number[] }) {
  return request('/api/permission/remove', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addPermission(params: TableListItem) {
  return request('/api/permission/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updatePermission(params: TableListParams) {
  return request('/api/permission/update', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
