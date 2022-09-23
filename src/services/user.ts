import {request} from '@/utils/net';

/**
 * 登录
 *  */
export async function login(data: API.LoginParams) {
    return request<API.LoginResult>({
        url: `${BASE_API}/users/login`,
        method: 'POST',
        data,
    });
}

/**
 * 获取当前用户信息
 *  */
export async function queryCurrentUser() {
    return request<API.CurrentUser>({
        url: `${BASE_API}/users/current`
    });
}

/**
 * 退出登录
 *  */
export async function loginOut() {
    return request<null>({
        url: `${BASE_API}/users/logout`,
        method: 'POST',
    });
}

/**
 * 修改密码
 *  */
export async function updatePassword(data: API.UpdatePasswordParams) {
    return request<null>({
        method: 'PATCH',
        url: `${BASE_API}/users/password`,
        data,
    });
}

/**
 * 忘记密码 获取邮件验证码
 *  */
export async function getCode(email: string) {
    return request<null>({
        method: 'POST',
        url: `${BASE_API}/users/authCode?email=${email}`
    });
}


/**
 * 创建帐号
 *  */
export async function createAccount(data: API.CreateAccountParams) {
    return request<null>({
        method: 'POST',
        url: `${BASE_API}/users`,
        data,
    });
}