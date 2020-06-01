const {
    app, 
    BrowserWindow, 
    ipcMain
} = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        }
    })

    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.webContents.send('')
    })

    mainWindow.loadFile('index.html')

    mainWindow.webContents.openDevTools()
}

app.whenReady().then(()=>{
    createWindow()

    app.on('activate', function(){
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed',function(){
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('toMain', (event, args) => {
    fs.readFile("test.txt", (error, data) => {

        mainWindow.webContents.send("fromMain", data)
    })
})

