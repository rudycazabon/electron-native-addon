// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {
  contextBridge,
  ipcRenderer,
  dialog
} = require('electron')

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

  const asyncMsgBtn = document.getElementById('btn_compute_mandelbrot')

  asyncMsgBtn.addEventListener('click', () => {
    ipcRenderer.send('msg_mandelbrot_compute', 'ping')
  })
  
  ipcRenderer.on('msg_mandelbrot_complete', (event, arg) => {
    const message = `Asynchronous message reply: ${arg}`
    document.getElementById('targetDiv').innerHTML = message
  })
})
