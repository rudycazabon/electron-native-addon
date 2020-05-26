const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        }
    })

    mainWindow.loadFile('index.html')

    // mainWindow.webContents.openDevTools()
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

ipcMain.on("toMain", (event, args) => {
    const { exec } = require("child_process");

    exec("mandelbrot", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});