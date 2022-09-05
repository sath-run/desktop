import {contextBridge, ipcRenderer} from 'electron'

let invokeCId = 0
const invokeCallbacks = {}
type Message = {
  bridgeName: string,
  cid: number,
  data: any
}
// 注册 nativeBridge
contextBridge.exposeInMainWorld(
  'electron',
  {
    invoke(bridgeName, data, callback) {
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
      invokeCId = invokeCId + 1
      // 存储回调函数
      invokeCallbacks[invokeCId] = callback
      message.cid = invokeCId
      ipcRenderer.send('postMessage', message)
      ipcRenderer.once('receiveMessage', (_, message): void => {
        const {data, cid, error} = message
        // 如果存在方法名，则调用对应函数
        if (typeof cid === 'number' && cid >= 1) {
          if (typeof error !== 'undefined') {
            invokeCallbacks[invokeCId](error)
            delete invokeCallbacks[invokeCId]
          } else if (invokeCallbacks[invokeCId]) {
            invokeCallbacks[cid](data)
            delete invokeCallbacks[invokeCId]
          } else {
            throw new Error('Invalid callback id')
          }
        } else {
          throw new Error('message format error')
        }
      })
    },
    EventsOn(event, callback) {
      if (typeof event !== 'string') {
        throw new Error('event failed!')
      }
      ipcRenderer.on(event, (_, data) => {
        callback && callback(data);
      })
    },
    EventsOff(event, callback) {
      if (typeof event !== 'string') {
        throw new Error('event failed!')
      }
      if(callback){
        ipcRenderer.removeListener(event, callback)
      }else{
        ipcRenderer.removeAllListeners(event)
      }
    }
  }
)
