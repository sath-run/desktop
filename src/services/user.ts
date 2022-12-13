import {request} from '@/utils/net';

/**
 * 登录
 *  */
export async function login(data: API.LoginParams) {
    return request<API.LoginResult>({
        url: `${ENGINE_API}/users/login`,
        method: 'POST',
        data: {
            ...data,
            account: data.email
        },
    });
}