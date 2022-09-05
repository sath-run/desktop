// 网络请求工具
import {extend} from 'umi-request'
import {notification} from 'antd'
import {MAC, TOKEN} from '@/constants';
import {useNavigate} from 'react-router-dom';


// 跳出登录页面
const gotoLoginPage = () => {
    const navigate = useNavigate();
    navigate('/login')
}

// 配置request请求时的默认参数
const request = extend({
    prefix: BASE_API
})
request.interceptors.request.use((url, options) => {
    const accessToken = localStorage.getItem(TOKEN)
    const headerOptions = {
        token: accessToken || ''
    }
    options.headers = Object.assign({}, options.headers, headerOptions);
    return {
        options
    }
})

type ErrorMsg = {
    code: string;
    message: string
}

// @ts-ignore
request.interceptors.response.use(async (response) => {
    if (response.status === 200) {
        try {
            return {success: true, data: await response.clone().json()};
        } catch (error) {
            return {success: true, data: await response.clone().text()};
        }
    }
    let result: ErrorMsg = {} as ErrorMsg;
    try {
        result = await response.clone().json();
    } catch (error) {}
    if (/\/api\/users\/(login|users\/current)/.test(response.url)) {
        return {success: false};
    }
    if (response.status === 403) {
        notification.error({
            message: '登录已过期，请重新登录'
        })
        setTimeout(() => {
            gotoLoginPage()
        }, 2000)
    } else {
        notification.error({
            message: `${result.code || response.status}`,
            description: result.message || response.statusText
        })
    }
    return {success: false};
})

export default request
