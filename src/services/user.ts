import { request } from 'umi';
import { TableListParams, TableListItem } from '@/services/user.d';

export async function query() {
  return request<API.response>('/api/users');
}

export async function queryCurrent() {
  return request<API.response>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

export async function queryUser(params?: TableListParams) {
  return request<API.response>('/api/user/query', {
    params,
  });
}

export async function showUser(params?: TableListParams) {
  return request<API.response>('/api/user/show', {
    params,
  });
}

export async function removeUser(params: { id: string[] }) {
  return request('/api/user/remove', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function createUser(params: TableListItem) {
  return request<API.response>('/api/user/create', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: TableListItem) {
  return request<API.response>('/api/user/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
