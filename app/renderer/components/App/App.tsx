import 'xterm/dist/xterm.css'

import React, { PureComponent } from 'react'
import { injectGlobal } from 'styled-components'
import { Terminal } from 'xterm'

const electron = window.require('electron')
const pty = electron.remote.require('node-pty')
const defaultShell = electron.remote.require('default-shell')
const os = electron.remote.require('os')

injectGlobal`
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

.terminal {
  height: 100%;
}
`

export default class App extends PureComponent {
  componentDidMount() {
    const xterm = new Terminal()

    const ptyProcess = pty.spawn(defaultShell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: os.homedir(),
      env: process.env
    })

    xterm.on('data', data => {
      ptyProcess.write(data)
    })

    ptyProcess.on('data', function(data: any) {
      xterm.write(data)
    })

    xterm.open(document.getElementById('xterm-container'))
  }

  render() {
    return <div id="xterm-conrtainer" />
  }
}
