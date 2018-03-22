import * as url from 'url'

import { BrowserWindow, app } from 'electron'

import { resolve } from 'app-root-path'

let mainWindow: Electron.BrowserWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 450,
    width: 750,
    title: 'Termio',
    backgroundColor: '#000',
    titleBarStyle: 'hidden-inset',
    frame: false
  })

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: resolve('build/index.html'),
      protocol: 'file:',
      slashes: true
    })

  mainWindow.loadURL(startUrl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
