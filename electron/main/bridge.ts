import {app, BrowserWindow, ipcMain, net} from 'electron'
import IpcMainEvent = Electron.IpcMainEvent;

type ClientRequestConstructorOptions = Electron.ClientRequestConstructorOptions;

ipcMain.on('postMessage', async (event, message) => {
    switch (message.bridgeName) {
        case 'startJob':
            startJob(event, message);
            break
        case 'stopJob':
            stopJob(event, message);
            break;
        case 'request':
            const result = await request(message.data);
            event.reply('receiveMessage', {
                bridgeName: 'request',
                cid: message.cid,
                data: result,
            })
            break;
        case 'setToken':
            setToken(event, message);
            break;
        case 'platform':
            event.reply('receiveMessage', {
                bridgeName: message.bridgeName,
                cid: message.cid,
                data: process.platform,
            })
            break
        case 'systemInfo':
            const systemMemoryInfo = process.getSystemMemoryInfo();
            const appMetrics = app.getAppMetrics();
            let cupUsage = 0, memory = 0;
            appMetrics.forEach(appMetric => {
                cupUsage += appMetric.cpu.percentCPUUsage;
                memory += appMetric.memory.workingSetSize;
            })
            event.reply('receiveMessage', {
                bridgeName: message.bridgeName,
                cid: message.cid,
                data: {
                    memory: Math.ceil(memory / systemMemoryInfo.total * 1000) / 10,
                    cpu: Math.ceil(cupUsage * 10) / 10
                },
            })
            break;
        default:
    }
})


const startJob = async (event: IpcMainEvent, message: any) => {
    const result = await request({
        method: 'POST',
        url: 'http://localhost:33566/services/start'
    })
    event.reply('receiveMessage', {
        bridgeName: 'startJob',
        cid: message.cid,
        data: result,
    })
    if (result.status === 200) {
        startListener()
    }
}

const setToken = async (event: IpcMainEvent, message: any) => {
    const result = await request({
        method: 'PATCH',
        url: 'http://localhost:33566/users/token'
    })
    event.reply('receiveMessage', {
        bridgeName: 'setToken',
        cid: message.cid,
        data: result,
    })
}

const startListener = async () => {
    const request = net.request({
        url: 'http://localhost:33566/jobs/current/stream'
    })
    request.on('response', (response) => {
        response.on('data', (chunk) => {
            const message = chunk.toString().replace(/^\n+/g, '').split(/\n/);
            const data = message[1].replace('data:', '');
            const allWindows = BrowserWindow.getAllWindows();
            allWindows.forEach(win => {
                win.webContents.send('progress', JSON.parse(data));
            })
        })
        response.on('end', () => {
            console.info('listener end')
        })
    })
    request.end();
}

const stopJob = async (event: IpcMainEvent, message: any) => {
    const result = await request({
        method: 'POST',
        url: 'http://localhost:33566/services/stop'
    })
    event.reply('receiveMessage', {
        bridgeName: 'stopJob',
        cid: message.cid,
        data: result,
    })
}

const request = (options: ClientRequestConstructorOptions & { headers?: { [propName: string]: string }, data?: any }) => {
    return new Promise<{
        status: number,
        data: any
    }>(resolve => {
        console.info(options)
        const request = net.request(options);
        request.setHeader('Content-Type', 'application/json');
        if (options.headers) {
            Object.keys(options.headers).forEach(key => {
                request.setHeader(key, options.headers ? options.headers[key] : '');
            })
        }
        request.on('response', (response) => {
            let dataList = Buffer.alloc(0);
            response.on('data', (chunk) => {
                dataList = Buffer.concat([dataList, chunk]);
            })
            response.on('end', () => {
                let body = dataList.toString();
                try {
                    body = JSON.parse(body);
                } catch (error) {
                }
                console.info('response:', response.statusCode)
                console.info('body：', body)
                resolve({
                    status: response.statusCode,
                    data: body
                })
            })
        })
        console.info('sendData:', JSON.stringify(options.data || '{}'))
        request.on('error', error => {
            console.error(error)
        })
        request.write(JSON.stringify(options.data || '{}'))
        request.end()
    })
}