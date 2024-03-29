import * as React from 'react'
import { connect } from 'react-redux'
import { ActionCreator, Dispatch } from 'redux'
import State from '../state/State'
import Ethereum from '../state/Ethereum'
import Auth from '../state/Auth'
import Address from '../../domain/Address'

function card (message: string) {
  return <div className="container-fixed">
    <div className="row justify-content-center">
      <div className="col-4">
        <div className="card mt-5">
          <div className="card-body text-center">
            <p className="my-0">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export interface StateProps {
  isEthereumAvailable: Ethereum.FindingState
}

export interface DispatchProps {
  findEthereumAvailable: ActionCreator<Promise<void>>
  identify: ActionCreator<Promise<Address | null>>
}

export class EthereumWaiter extends React.Component<StateProps & DispatchProps> {
  async componentDidMount () {
    await this.props.identify()
    await this.props.findEthereumAvailable()
  }

  render () {
    switch (this.props.isEthereumAvailable) {
      case Ethereum.FindingState.CHECKING:
        return this.renderChecking()
      case Ethereum.FindingState.AVAILABLE:
        return this.renderChildren()
      case Ethereum.FindingState.UNAVAILABLE:
        return this.renderUnavailable()
    }
  }

  renderUnavailable () {
    return card('Can not load Vynos wallet. Please use a modern browser.')
  }

  renderChildren () {
    return this.props.children
  }

  renderChecking () {
    return card('Waiting for Vynos...')
  }
}

function mapStateToProps (state: State): StateProps {
  return {
    isEthereumAvailable: state.ethereum.isAvailable
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>): DispatchProps {
  return {
    findEthereumAvailable: () => dispatch(Ethereum.findProvider({})),
    identify: () => dispatch(Auth.identify({}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EthereumWaiter)
