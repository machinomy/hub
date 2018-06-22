import * as React from 'react'
import { Provider } from 'react-redux'
import State from '../state/State'
import { Switch, Route, MemoryRouter, Redirect } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import EthereumWaiter from './EthereumWaiter'
import Login from './Login'
import { hot } from 'react-hot-loader'
import Channels from './Channels'

export class Application extends React.Component {
  render () {
    return <Provider store={State.store}>
      <EthereumWaiter>
        <MemoryRouter>
          <Switch>
            <Route exact={true} path="/login" component={Login} />
            <Route path="/">
              <Dashboard>
                <Switch>
                  <Route exact={true} path="/" render={() => <Redirect to="/channels" />} />
                  <Route path="/channels" component={Channels} />
                </Switch>
              </Dashboard>
            </Route>
          </Switch>
        </MemoryRouter>
      </EthereumWaiter>
    </Provider>
  }
}

export default hot(module)(Application)
