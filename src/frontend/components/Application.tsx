import * as React from 'react'
import { Provider } from 'react-redux'
import State from '../state/State'
import { Switch, Route, Redirect, MemoryRouter} from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import EthereumWaiter from './EthereumWaiter'
import Login from "./Login"
import { hot } from 'react-hot-loader'

export class Application extends React.Component {
  render () {
    return <Provider store={State.store}>
      <MemoryRouter>
        <EthereumWaiter>
          <Switch>
            <Route exact={true} path="/login" component={Login} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </EthereumWaiter>
      </MemoryRouter>
    </Provider>
  }
}

export default hot(module)(Application)
