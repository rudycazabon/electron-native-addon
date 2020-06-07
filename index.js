const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const glob = require('glob')
const fs = require('fs')

let mainWindow = null

makeSingleInstance()

loadDemos()

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true
        }
    })
    
    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.webContents.send('')
    })
    
    mainWindow.loadFile('index.html')
    
    mainWindow.webContents.openDevTools()
    
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function makeSingleInstance () {
    if (process.mas) return
  
    app.requestSingleInstanceLock()
  
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }
  
  // Require each JS file in the main-process dir
  function loadDemos () {
    const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    files.forEach((file) => { require(file) })
  }