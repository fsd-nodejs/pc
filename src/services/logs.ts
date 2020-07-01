import { request } from 'umi';
import { TableListParams } from '@/services/logs.d';

export async function queryLogs(params?: TableListParams) {
  return request<API.response>('/api/logs/query', {
    params,
  });
}

export async function removeLogs(params: { id: string[] }) {
  return request('/api/logs/remove', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}
