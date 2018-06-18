import { createStore, applyMiddleware, combineReducers, Store } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

export interface State {

}

export namespace State {
  const reducers = combineReducers({})
  const middleware = applyMiddleware(thunk, logger)

  export const store = createStore(reducers, middleware)
}

export default State
