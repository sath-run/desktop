import {app, BrowserWindow, shell, ipcMain, Menu, net} from 'electron'
import {release} from 'os'
import {join} from 'path'
import {ClientRequest} from "http";
// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName())
    Menu.setApplicationMenu(null)
}
if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

app.commandLine.appendSwitch('disable-web-security');

export const ROOT_PATH = {
    // /dist
    dist: join(__dirname, '../..'),
    // /dist or /public
    public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {
    win = new BrowserWindow({
        title: 'Screening@Home',
        icon: join(ROOT_PATH.public, 'electron.png'),
        width: 760,
        height: 820,
        minWidth: 760,
        minHeight: 820,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2496ed',
            symbolColor: '#000000'
        },
        webPreferences: {
            preload,
            nodeIntegration: true,
            webSecurity: false,
            devTools: true
        },
    })
    console.info('url:', url)
    if (app.isPackaged) {
        win.loadFile(indexHtml)
    } else {
        win.loadURL(url)
        // win.webContents.openDevTools()
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return {action: 'deny'}
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
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
            } catch (error) {};
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
        if(response.statusCode === 200){
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
            win.webContents.send('progress', JSON.parse(data));
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
            } catch (error) {};
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
