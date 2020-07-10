import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.Response>('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request<API.Response>(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request<API.Response>('/api/login/outLogin');
}
