import './Term.css'

import * as fit from 'xterm/lib/addons/fit/fit'

import React, { Fragment, PureComponent } from 'react'

import ReactResizeDetector from 'react-resize-detector'
import { Terminal } from 'xterm'

const electron = window.require('electron')
const pty = electron.remote.require('node-pty')
const defaultShell = electron.remote.require('default-shell')
const os = electron.remote.require('os')

Terminal.applyAddon(fit)

let xterm: any

export default class Term extends PureComponent {
  componentDidMount() {
    xterm = new Terminal({
      cursorBlink: true,
      fontSize: 12
    })

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

  onResize = () => {
    xterm.resize(xterm)
    xterm.fit()
  }

  render() {
    return (
      <Fragment>
        <div id="termio" />
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.onResize}
        />
      </Fragment>
    )
  }
}
