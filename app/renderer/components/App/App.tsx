import './App.css'

import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import Routes from '../../routes/Routes'

const App = () => (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
)

export default App
