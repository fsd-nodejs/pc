import { request } from 'umi';

export async function query() {
  return request<API.response>('/api/users');
}

export async function queryCurrent() {
  return request<API.response>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
