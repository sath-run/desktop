interface Options {
    method?: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';
    url: string | undefined;
    data?: any,
    headers?: {
        [propName: string]: string
    }
}

export function request<T>(options: Options | string) {
    return new Promise<API.Response<T>>(resolve => {
        window.electron.invoke('request', options, (result: API.Response<T>) => {
            console.info('request:', result)
            resolve(result);
        })
    })
}