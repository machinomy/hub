import actionCreatorFactory from 'typescript-fsa'
import { bindThunkAction } from 'typescript-fsa-redux-thunk'
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'
import * as Web3 from 'web3'
import AuthClient from '../services/AuthClient';
import Backend from '../services/Backend';
import Eth from '../../support/Eth';
import Address from '../../domain/Address'

const actionCreator = actionCreatorFactory('auth')

interface Auth {
  address?: Address
}

let backend = new Backend()
let authClient = new AuthClient(backend)

namespace Auth {
  const INITIAL: Auth = {
  }

  const authenticateAction = actionCreator.async<Web3.Provider, Address>('authenticate')

  export const authenticate = bindThunkAction(authenticateAction, async provider => {
    let eth = await Eth.fromProvider(provider)
    return authClient.authenticate(eth)
  })

  const identifyAction = actionCreator.async<{}, Address | null>('identify')

  export const identify = bindThunkAction(identifyAction, async () => {
    console.log('IDENTIFY')
    let address = await authClient.identify()
    console.log('GOT ADDR', address)
    return address
  })

  export const reducers: ReducerBuilder<Auth, Auth> = reducerWithInitialState<Auth>(INITIAL)
    .case(authenticateAction.done, (state, payload) => ({...state, address: payload.result }))
    .case(identifyAction.done, (state, payload) => {
      if (payload.result) {
        return { ...state, address: payload.result }
      } else {
        return state
      }
    })
}

export default Auth
