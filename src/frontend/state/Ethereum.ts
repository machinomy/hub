import actionCreatorFactory from 'typescript-fsa'
import { bindThunkAction } from 'typescript-fsa-redux-thunk'
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'
import vynos from 'vynos'

const actionCreator = actionCreatorFactory('ethereum')

interface Ethereum {
  isAvailable: Ethereum.FindingState
}

namespace Ethereum {
  export enum FindingState {
    CHECKING,
    AVAILABLE,
    UNAVAILABLE
  }

  const INITIAL: Ethereum = {
    isAvailable: FindingState.CHECKING
  }

  const findProviderAction = actionCreator.async<{}, FindingState>('findProvider')

  export const findProvider = bindThunkAction(findProviderAction, async () => {
    try {
      await vynos.ready()
      return FindingState.AVAILABLE
    } catch (e) {
      return FindingState.UNAVAILABLE
    }
  })

  const displayVynosAction = actionCreator.async('displayVynos')

  export const displayVynos = bindThunkAction(displayVynosAction, async () => {
    await vynos.display()
    return {}
  })

  export const reducers: ReducerBuilder<Ethereum, Ethereum> = reducerWithInitialState<Ethereum>(INITIAL)
    .case(findProviderAction.started, state => ({ ...state, isAvailable: FindingState.CHECKING }))
    .case(findProviderAction.failed, state => ({ ...state, isAvailable: FindingState.UNAVAILABLE }))
    .case(findProviderAction.done, (state, params) => ({ ...state, isAvailable: params.result }))
}

export default Ethereum
