import * as React from 'react'
import { Provider } from 'react-redux'
import State from '../state/State'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import EthereumWaiter from './EthereumWaiter'

export default class Application extends React.Component {
  render () {
    return <Provider store={State.store}>
      <BrowserRouter>
        <EthereumWaiter>
          <Dashboard>
          </Dashboard>
        </EthereumWaiter>
      </BrowserRouter>
    </Provider>
  }
}
