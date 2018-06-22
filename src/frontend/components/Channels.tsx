import * as React from 'react'
import {connect} from 'react-redux'
import { Dispatch } from 'redux'
import State from '../state/State'
import { RouteComponentProps, withRouter } from 'react-router'
import Offchain from '../state/Offchain'
import Address from '../../domain/Address'
import {SerializedPaymentChannel} from 'machinomy/lib/PaymentChannel'
import * as validate from 'validate.js'
import styled from 'react-emotion';

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

const ChannelRow = styled('tr')`
  font-size: x-small;
`

const Col = styled('td')`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
`


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
    return <table className="table table-striped table-hover table-sm">
      <thead>
        <tr className="d-flex">
          <th scope="col" className="col-3">ID</th>
          <th scope="col" className="col-1">Spent</th>
          <th scope="col" className="col-1">Value</th>
          <th scope="col" className="col-3">Sender</th>
          <th scope="col" className="col-3">Receiver</th>
          <th scope="col" className="col-1"></th>
        </tr>
      </thead>
      <tbody>
        {this.renderRows()}
      </tbody>
    </table>
  }

  renderRows () {
    if (validate.isEmpty(this.props.channels)) {
      return <tr>
        <td>No channels available</td>
      </tr>
    } else {
      return this.props.channels.map(channel => {
        return <ChannelRow key={channel.channelId} className="d-flex">
          <Col className="col-3 align-middle">{channel.channelId}</Col>
          <Col className="col-1 align-middle">{channel.spent}</Col>
          <Col className="col-1 align-middle">{channel.value}</Col>
          <Col className="col-3 align-middle">{channel.sender}</Col>
          <Col className="col-3 align-middle">{channel.receiver}</Col>
          <Col className="col-1 align-middle">
            {this.closeButton(channel)}
          </Col>
        </ChannelRow>
      })
    }
  }

  async handleCloseChannelButton (channelId: string) {
    if (confirm('Are you sure to close channel?')) {
      await this.props.closeChannel(channelId)
    }
  }

  closeButton (channel: SerializedPaymentChannel) {
    switch (channel.state) {
      case 0:
        return <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => this.handleCloseChannelButton(channel.channelId) }>
          Close
        </button>
      case 1:
        return <button type="button" className="btn btn-danger btn-sm btn-block" disabled={true}>
          Close
        </button>
      case 2:
        return <button type="button" className="btn btn-outline-success btn-sm btn-block" disabled={true}>
          Settled
        </button>
      default:
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
