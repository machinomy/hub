import * as React from 'react'
import { connect } from 'react-redux'
import { ActionCreator, Dispatch } from 'redux'
import State from '../state/State'
import Ethereum from '../state/Ethereum'

export interface StateProps {
  isEthereumAvailable: Ethereum.FindingState
}

export interface DispatchProps {
  findEthereumAvailable: ActionCreator<Promise<void>>
}

export class EthereumWaiter extends React.Component<StateProps & DispatchProps> {
  async componentDidMount () {
    await this.props.findEthereumAvailable()
  }

  render () {
    switch (this.props.isEthereumAvailable) {
      case Ethereum.FindingState.CHECKING:
        return this.renderPlaceholder()
      case Ethereum.FindingState.AVAILABLE:
        return this.renderChildren()
      case Ethereum.FindingState.UNAVAILABLE:
        return this.renderUnavailable()
    }
  }

  renderUnavailable () {
    return <div>Unavailable</div>
  }

  renderChildren () {
    return this.props.children
  }

  renderPlaceholder () {
    return <div>Waiting...</div>
  }
}

function mapStateToProps (state: State): StateProps {
  return {
    isEthereumAvailable: state.ethereum.isAvailable
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>) {
  return {
    findEthereumAvailable: () => dispatch(Ethereum.findProvider({}))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EthereumWaiter)
