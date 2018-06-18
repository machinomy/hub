import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import State from './state/State'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './components/Dashboard'

let application = <Provider store={State.store}>
  <BrowserRouter>
    <Dashboard>
    </Dashboard>
  </BrowserRouter>
</Provider>

let container = document.createElement('div')
document.body.appendChild(container)

ReactDOM.render(application, container)
