import * as React from 'react'
import {connect} from 'react-redux'
import { Dispatch } from 'redux'
import State from '../state/State'
import { RouteComponentProps, withRouter } from 'react-router'
import Offchain from '../state/Offchain'
import Address from '../../domain/Address'
import {SerializedPaymentChannel} from 'machinomy/lib/PaymentChannel'
import * as validate from 'validate.js'

export interface StateProps {
  address: string
  channels: Array<SerializedPaymentChannel>
}

export interface DispatchProps {
  fetchChannels: (address: Address) => Promise<Array<SerializedPaymentChannel>>
  closeChannel: (channelId: string) => Promise<string>
}

export type Props = RouteComponentProps<{}> & StateProps & DispatchProps

export interface ChannelsState {
  isLoading: boolean
}

export class Channels extends React.Component<Props, ChannelsState> {
  constructor (props: Props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  async componentDidMount () {
    await this.props.fetchChannels(this.props.address)
    this.setState({
      isLoading: false
    })
  }

  render () {
    let child = this.state.isLoading ? <p>Loading...</p> : <div><h1>Channels</h1>{this.renderTable()}</div>
    return <div className="container">
      <div className="row">
        <div className="col">
          {child}
        </div>
      </div>
    </div>
  }

  renderTable () {
    return <div className="table">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Spent</th>
            <th>Value</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </table>
    </div>
  }

  renderRows () {
    if (validate.isEmpty(this.props.channels)) {
      return <tr>
        <td>No channels available</td>
      </tr>
    } else {
      return this.props.channels.map(channel => {
        return <tr key={channel.channelId}>
          <td>{channel.channelId}</td>
          <td>{channel.spent}</td>
          <td>{channel.value}</td>
          <td>{channel.sender}</td>
          <td>{channel.receiver}</td>
          <td>
            {this.closeButton(channel)}
          </td>
        </tr>
      })
    }
  }

  async handleCloseChannelButton (channelId: string) {
    if (confirm('Are you sure to close channel?')) {
      await this.props.closeChannel(channelId)
    }
  }

  closeButton (channel: SerializedPaymentChannel) {
    if (channel.state == 0) {
      return <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#closeChannelModal" onClick={() => this.handleCloseChannelButton(channel.channelId) }>
        Close
      </button>
    } else {
      return null
    }
  }
}

function mapStateToProps (state: State): StateProps {
  return {
    address: state.auth.address!,
    channels: state.offchain.channels
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>) {
  return {
    fetchChannels: (address: Address) => dispatch(Offchain.fetchChannels(address)),
    closeChannel: (channelId: string) => dispatch(Offchain.closeChannel(channelId))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Channels))
