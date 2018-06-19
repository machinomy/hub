import * as React from 'react'
import { connect } from 'react-redux'
import { ActionCreator, Dispatch } from 'redux'
import State from '../state/State'
import Ethereum from '../state/Ethereum'
import Navbar from "./Navbar";

export interface StateProps {
  isEthereumAvailable: Ethereum.FindingState
}

export interface DispatchProps {
}

export class Dashboard extends React.Component<StateProps & DispatchProps> {
  async componentDidMount () {
  }

  render () {
    return <div>
      <Navbar />
      {this.props.children}
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
    // queryEthereum: () => dispatch(Ethereum.findProvider({}))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
