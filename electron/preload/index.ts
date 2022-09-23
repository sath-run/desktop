import {contextBridge, ipcRenderer} from 'electron'

const invokeCallbacks: { [propName: string]: (args: any) => any } = {}
type Message = {
    bridgeName: string,
    cid: string,
    data: any
}
// 注册 nativeBridge
contextBridge.exposeInMainWorld(
    'electron',
    {
        invoke(bridgeName: string, data: any, callback: () => any) {
            if (typeof bridgeName !== 'string') {
                throw new Error('Invoke failed!')
            }
            if (!callback && typeof data === 'function') {
                callback = data;
                data = {};
            }
            // 与 Native 的通信信息
            const message: Message = {bridgeName} as Message;
            if (typeof data !== 'undefined' || data !== null) {
                message.data = data
            }
            if (typeof callback !== 'function') {
                callback = () => null
            }
            const invokeCId = `${bridgeName}_${Date.now()}`;
            // 存储回调函数
            invokeCallbacks[invokeCId] = callback
            message.cid = invokeCId
            ipcRenderer.send('postMessage', message)
            ipcRenderer.once('receiveMessage', (_, message): void => {
                const {data, cid, error} = message
                if (cid) {
                    if (typeof error !== 'undefined') {
                        invokeCallbacks[cid](error)
                        delete invokeCallbacks[cid]
                    } else if (invokeCallbacks[cid]) {
                        invokeCallbacks[cid](data)
                        delete invokeCallbacks[cid]
                    } else {
                        throw new Error('Invalid callback id')
                    }
                } else {
                    throw new Error('message format error')
                }
            })
        },
        EventsOn(event: string, callback: (args: any) => any) {
            if (typeof event !== 'string') {
                throw new Error('event failed!')
            }
            ipcRenderer.on(event, (_, data) => {
                callback && callback(data);
            })
        },
        EventsOff(event: string, callback: (args: any) => any) {
            if (typeof event !== 'string') {
                throw new Error('event failed!')
            }
            if (callback) {
                ipcRenderer.removeListener(event, callback)
            } else {
                ipcRenderer.removeAllListeners(event)
            }
        }
    }
)
