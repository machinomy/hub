import actionCreatorFactory, { AsyncActionCreators }  from 'typescript-fsa'
import { bindThunkAction } from 'typescript-fsa-redux-thunk'
import { reducerWithInitialState, ReducerBuilder } from 'typescript-fsa-reducers'
import vynos from 'vynos'

const actionCreator = actionCreatorFactory('ethereum')

export interface Ethereum {
  isAvailable: Ethereum.FindingState
}

export namespace Ethereum {
  export enum FindingState {
    CHECKING,
    AVAILABLE,
    UNAVAILABLE
  }

  const INITIAL: Ethereum = {
    isAvailable: FindingState.CHECKING
  }

  export const findProviderAction = actionCreator.async<{}, FindingState>('findProvider')

  export const findProvider = bindThunkAction(findProviderAction, async () => {
    try {
      await vynos.ready()
      return FindingState.AVAILABLE
    } catch (e) {
      return FindingState.UNAVAILABLE
    }
  })

  export const reducers = reducerWithInitialState<Ethereum>(INITIAL)
    .case(findProviderAction.started, state => ({ ...state, isAvailable: FindingState.CHECKING }))
    .case(findProviderAction.failed, state => ({ ...state, isAvailable: FindingState.UNAVAILABLE }))
    .case(findProviderAction.done, (state, params) => ({ ...state, isAvailable: params.result }))
}

export default Ethereum
