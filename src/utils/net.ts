interface Options {
    method?: string;
    url?: string | undefined;
    data?: any
}

export function request<T>(options: Options | string) {
    return new Promise<API.Response<T>>(resolve => {
        window.electron.invoke('request', options, (result: API.Response<T>) => {
            console.info('request:', result)
            resolve(result);
        })
    })
}