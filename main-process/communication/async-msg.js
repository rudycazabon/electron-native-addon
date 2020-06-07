const {ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')
const util = require('util');
const exec = util.promisify(require('child_process').exec, { shell: false });

async function mandelbrot() {
  const { stdout, stderr } = await exec(path.join(__dirname, '../../bin/mandelbrot.bat'));
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  console.log(`${stdout}`);
  return stdout;
}

async function teapot() {
  const { stdout, stderr } = await exec(path.join(__dirname, '../../bin/Serialize.exe'));
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  console.log(`${stdout}`);
  return stdout;
}

async function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(path.join(__dirname, '../../bin/mandelbrot.bat'), (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
 }


ipcMain.on('asynchronous-message', (event, arg) => {
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('msg_mandelbrot_compute', (event, arg) => {
  const complete = mandelbrot()
  console.log( complete );
  event.sender.send('msg_mandelbrot_complete','Compute Started')
})

ipcMain.on('msg_teapot_compute', (event, arg) => {
  const complete = teapot()
  console.log( complete );
  event.sender.send('msg_teapot_complete','Compute Started')
})
