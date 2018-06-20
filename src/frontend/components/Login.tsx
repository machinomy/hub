import * as React from 'react'
import { connect } from 'react-redux'
import { ActionCreator, Dispatch } from 'redux'
import State from '../state/State'
import vynos from 'vynos'
import { RouteComponentProps, withRouter } from 'react-router'
import Auth from "../state/Auth";

export interface StateProps {
  isAuthenticated: boolean
}

export interface DispatchProps {
  authenticate: ActionCreator<Promise<string>>
}

export type Props = RouteComponentProps<{}> & StateProps & DispatchProps

export interface OwnState {
  isAuthenticating: boolean
  isVynosAvailable: boolean
}

export class Login extends React.Component<Props, OwnState> {
  constructor (props: Props) {
    super(props)
    this.state = {
      isAuthenticating: false,
      isVynosAvailable: false
    }
    this.handleSignInButtonClick = this.handleSignInButtonClick.bind(this)
  }

  async componentDidMount () {
    let wallet = await vynos.ready()
    await wallet.initAccount
    this.setState({
      isVynosAvailable: true
    })
  }

  render () {
    return (
      <div className="container-fixed">
        <div className="row justify-content-center">
          <div className="col-9">
            <div className="mt-5">
              <div className="text-center">
                <p>Please use your Vynos account to sign in</p>
                {this.renderButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  async handleSignInButtonClick () {
    this.setState({
      isAuthenticating: true
    })

    try {
      await this.props.authenticate()
      // this.props.history.push('/admin/payments')
    } catch (e) {
      console.error(e)
      this.setState({
        isAuthenticating: false
      })
    }
  }

  renderButton () {
    if (this.state.isAuthenticating) {
      return (
        <button className="btn btn-lg btn-primary" disabled={true}>
          Authenticating...
        </button>
      )
    }

    return (
      <button className="btn btn-lg btn-primary" disabled={!this.state.isVynosAvailable} onClick={this.handleSignInButtonClick}>
        Sign In With Vynos
      </button>
    )
  }
}

function mapStateToProps (state: State): StateProps {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>) {
  return {
    authenticate: () => dispatch(Auth.authenticate({}))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
