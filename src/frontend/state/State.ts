import { createStore, applyMiddleware, combineReducers, Store } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import Ethereum from './Ethereum'

export interface State {
  ethereum: Ethereum
}

export namespace State {
  const reducers = combineReducers({
    ethereum: Ethereum.reducers
  })
  const middleware = applyMiddleware(thunk, logger)

  export const store = createStore(reducers, middleware)
}

export default State
