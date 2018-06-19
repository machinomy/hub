import * as React from 'react'
import { connect } from 'react-redux'
import { ActionCreator, Dispatch } from 'redux'
import State from '../state/State'
import Ethereum from '../state/Ethereum'

export interface StateProps {
  isEthereumAvailable: Ethereum.FindingState
}

export interface DispatchProps {
  findEthereumProvider: ActionCreator<Promise<void>>
}

export class Dashboard extends React.Component<StateProps & DispatchProps> {
  async componentDidMount () {
    await this.props.findEthereumProvider()
  }

  render () {
    return <div id="app">
      Dashboard
      <div>
        {this.props.children}
      </div>
    </div>
  }
}

function mapStateToProps (state: State): StateProps {
  return {
    isEthereumAvailable: state.ethereum.isAvailable
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>) {
  return {
    findEthereumProvider: () => dispatch(Ethereum.findProvider({}))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
