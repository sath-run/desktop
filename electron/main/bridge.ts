import {app, BrowserWindow, ipcMain, net} from 'electron'


ipcMain.on('postMessage', async (event, message) => {
    switch (message.bridgeName) {
        case 'startJob':
            startJob(event, message);
            break
        case 'stopJob':
            stopJob(event, message);
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


const startJob = async (event, message) => {
    const request = net.request({
        method: 'POST',
        url: 'http://localhost:33566/services/start'
    })
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
            ;
            console.info('body：', body)
            event.reply('receiveMessage', {
                bridgeName: 'startJob',
                cid: message.cid,
                data: {
                    status: response.statusCode,
                    data: body
                },
            })
        })
        if (response.statusCode === 200) {
            startListener()
        }
    })
    request.end();
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

const stopJob = async (event, message) => {
    const request = net.request({
        method: 'POST',
        url: 'http://localhost:33566/services/stop'
    })
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
            ;
            console.info('body：', body)
            event.reply('receiveMessage', {
                bridgeName: 'stopJob',
                cid: message.cid,
                data: {
                    status: response.statusCode,
                    data: body
                },
            })
        })
    })
    request.end();
}