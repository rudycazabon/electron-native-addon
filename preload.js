// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { 
  contextBridge,
  ipcRenderer
} = require('electron')
const { remote } = require('electron')

const addon = require('bindings')('hello')



window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) {
          element.innerText = text
        }
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }

    replaceText('addon-version', addon.hello())
})


const util = require('util');
const exec = util.promisify(require('child_process').exec, { shell: true });
async function mandelbrot() {
  const { stdout, stderr } = await exec('./mandelbrot');
  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  console.log(`${stdout}`);
}

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      let validChannels = ["toMain"]
      if( validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    receive: (channel, func) => {
      let validChannels = ["fromMain"]
      if( validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, args) => {
          console.log(args)
        })
      }
    }
  }
)