import {app, BrowserWindow, shell, Menu} from 'electron'
import {release} from 'os'
import {join} from 'path'
import './bridge'
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
            webSecurity: true,
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


process.on('uncaughtException', function (error) {
   console.info('error:', error)
})
