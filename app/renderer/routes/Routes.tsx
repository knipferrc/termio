import * as React from 'react'

import { Route, Switch } from 'react-router-dom'

import Terminal from './Terminal/Terminal'

const Routes = () => (
  <Switch>
    <Route path="/" component={Terminal} />
  </Switch>
)

export default Routes
