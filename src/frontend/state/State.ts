import { createStore, applyMiddleware, combineReducers, Store } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import Ethereum from './Ethereum'
import Auth from './Auth'

export interface State {
  ethereum: Ethereum
  auth: Auth
}

export namespace State {
  const reducers = combineReducers({
    ethereum: Ethereum.reducers,
    auth: Auth.reducers
  })
  const middleware = applyMiddleware(thunk, logger)

  export const store = createStore(reducers, middleware)
}

export default State
