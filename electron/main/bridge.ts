import {app, BrowserWindow, ipcMain, net, shell} from 'electron'

type ClientRequestConstructorOptions = Electron.ClientRequestConstructorOptions;

const engineAddress = 'http://localhost:33566';

ipcMain.on('postMessage', async (event, message) => {
    switch (message.bridgeName) {
        case 'startListener':
            startListener();
            break
        case 'request':
            const result = await request(message.data);
            event.reply(message.cid, {
                bridgeName: message.bridgeName,
                cid: message.cid,
                data: result,
            })
            break;
        case 'platform':
            event.reply(message.cid, {
                bridgeName: message.bridgeName,
                cid: message.cid,
                data: process.platform,
            })
            break
        case 'openUrl':
            shell.openExternal(message.data);
            break
        case 'systemInfo':
            const systemMemoryInfo = process.getSystemMemoryInfo();
            const appMetrics = app.getAppMetrics();
            let cupUsage = 0, memory = 0;
            appMetrics.forEach(appMetric => {
                cupUsage += appMetric.cpu.percentCPUUsage;
                memory += appMetric.memory.workingSetSize;
            })
            event.reply(message.cid, {
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


const startListener = async () => {
    const request = net.request({
        url: `${engineAddress}/jobs/current/stream`
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
                resolve({
                    status: response.statusCode,
                    data: body
                })
            })
        })
        request.on('error', error => {
            console.error(error)
        })
        request.write(JSON.stringify(options.data || '{}'))
        request.end()
    })
}