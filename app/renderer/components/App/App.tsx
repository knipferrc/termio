import './App.css'

import React, { PureComponent } from 'react'
import { Terminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'

const electron = window.require('electron')
const pty = electron.remote.require('node-pty')
const defaultShell = electron.remote.require('default-shell')
const os = electron.remote.require('os')

Terminal.applyAddon(fit)

export default class App extends PureComponent {
  componentDidMount() {
    const xterm: any = new Terminal()

    const ptyProcess = pty.spawn(defaultShell, [], {
      name: 'xterm-color',
      cwd: os.homedir(),
      env: process.env
    })

    xterm.on('data', (data: any) => {
      ptyProcess.write(data)
    })

    ptyProcess.on('data', (data: any) => {
      xterm.write(data)
    })

    xterm.open(document.getElementById('termio'))

    xterm.resize(xterm)

    xterm.fit()
  }

  render() {
    return <div id="termio" />
  }
}
