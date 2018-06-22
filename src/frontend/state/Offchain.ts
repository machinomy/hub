import { SerializedPaymentChannel } from 'machinomy/lib/PaymentChannel'
import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'
import { bindThunkAction } from 'typescript-fsa-redux-thunk'
import actionCreatorFactory from 'typescript-fsa'
import Address from '../../domain/Address'
import Backend from '../services/Backend'

const actionCreator = actionCreatorFactory('offchain')

interface Offchain {
  channels: Array<SerializedPaymentChannel>
}

const backend = Backend.instance

namespace Offchain {
  const INITIAL: Offchain = {
    channels: []
  }

  const fetchChannelsAction = actionCreator.async<Address, Array<SerializedPaymentChannel>>('fetchChannels')
  export const fetchChannels = bindThunkAction(fetchChannelsAction, async address => {
    type Result = { channels: Array<SerializedPaymentChannel> }
    let result = await backend.query<Result>(`
      query Channels {
        channels {
          channelId
          spent
          value
          sender
          receiver
          state
        }
      }
    `)
    return result.channels
  })

  const closeChannelAction = actionCreator.async<string, string>('closeChannel')
  export const closeChannel = bindThunkAction(closeChannelAction, async channelId => {
    let result = await backend.query(`
      mutation CloseChannel {
        closeChannel(channelId: "${channelId}") {
          channelId
          spent
          value
          sender
          receiver
          state
        }
      }
    `)

    console.log('closeChannel', result)
    return channelId
  })

  export const reducers: ReducerBuilder<Offchain, Offchain> = reducerWithInitialState<Offchain>(INITIAL)
    .case(fetchChannelsAction.done, (state, payload) => ({ ...state, channels: payload.result }))
}

export default Offchain
