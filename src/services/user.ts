import request from '@/utils/request';

/**
 * 登录
 *  */
export async function login(data: API.LoginParams) {
  return request<API.Response<API.LoginResult>>('/users/login', {
    method: 'POST',
    data,
  });
}

/**
 * 获取当前用户信息
 *  */
export async function queryCurrentUser() {
  return request<API.Response<API.CurrentUser>>('/users/current', {
    method: 'GET'
  });
}

/**
 * 退出登录
 *  */
export async function loginOut() {
  return request.post<API.Response<null>>('/users/logout');
}

/**
 * 修改密码
 *  */
export async function updatePassword(data: API.UpdatePasswordParams) {
  return request<API.Response<null>>('/users/password', {
    method: 'PATCH',
    data,
  });
}

/**
 * 获取邮件验证码
 *  */
export async function getCode(params: API.GetCodeParams) {
  return request.get<API.Response<null>>('/users/code', {params});
}


/**
 * 创建帐号
 *  */
export async function createAccount(data: API.CreateAccountParams) {
  console.info('data:', data)
  return request<API.Response<null>>('/users', {
    method: 'POST',
    data,
  });
}