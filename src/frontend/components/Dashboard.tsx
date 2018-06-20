import * as React from 'react'
import { connect } from 'react-redux'
import State from '../state/State'
import Navbar from './Navbar'
import {Redirect, RouteComponentProps, withRouter} from 'react-router'

export interface StateProps {
  isAuthenticated: boolean
}

export type Props = RouteComponentProps<{}> & StateProps

export class Dashboard extends React.Component<Props> {
  render () {
    if (this.props.isAuthenticated) {
      return <div>
        <Navbar />
      </div>
    } else {
      return <Redirect push to='/login' />
    }
  }
}

function mapStateToProps (state: State): StateProps {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard))
