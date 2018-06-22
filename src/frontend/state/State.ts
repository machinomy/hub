import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import Ethereum from './Ethereum'
import Auth from './Auth'
import { Store } from 'react-redux'
import Offchain from './Offchain'

export interface State {
  ethereum: Ethereum
  auth: Auth
  offchain: Offchain
}

export namespace State {
  const reducers = combineReducers<State>({
    ethereum: Ethereum.reducers,
    auth: Auth.reducers,
    offchain: Offchain.reducers
  })
  const middleware = applyMiddleware(thunk, logger)

  export const store: Store<State> = createStore<State>(reducers, middleware)
}

export default State
