import actionCreatorFactory from 'typescript-fsa'
import { bindThunkAction } from 'typescript-fsa-redux-thunk'
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'

const actionCreator = actionCreatorFactory('auth')

interface Auth {
  isAuthenticated: boolean
}

namespace Auth {
  const INITIAL: Auth = {
    isAuthenticated: false
  }

  const authenticateAction = actionCreator.async<{}, string>('authenticate')

  export const authenticate = bindThunkAction(authenticateAction, async () => {
    // const client = new AuthenticationClient(backend.fullHost(), w3(), fetch.bind(window))
    // const accounts = await pify<string[]>(cb => w3().eth.getAccounts(cb))
    // console.log('login.accounts', accounts)
    // const res = await client.authenticate(accounts[0], window.location.hostname)
    // return dispatch(setAddress(res.address))

    return 'address'
  })

  export const reducers: ReducerBuilder<Auth, Auth> = reducerWithInitialState<Auth>(INITIAL)
    .case(authenticateAction.started, state => state)
    .case(authenticateAction.failed, state => state)
    .case(authenticateAction.done, state => state)
}

export default Auth
