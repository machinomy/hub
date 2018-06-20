import * as React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import State from '../state/State'
import Ethereum from '../state/Ethereum'
import { ActionCreator, Dispatch } from 'redux'

const NavLink = ({ to, children }: { to: string, children: any }) => {
  return (
    <Route
      path={to}
      exact={true}
      children={
        ({ match }) => {
          const classNames = `nav-item ${match ? 'active' : ''}`
          return (
            <li className={classNames}>
              <Link to={to} className="nav-link">{children}</Link>
            </li>
          )
        }}
    />
  )
}

export interface DispatchProps {
  displayVynos: ActionCreator<Promise<void>>
}

export class Navbar extends React.Component<DispatchProps> {
  render () {
    let navStyle = {
      borderBottom: '1px solid #de5080'
    }
    return <div>
      <nav className="navbar navbar-expand-lg navbar-light" style={navStyle}>
        <div className="container">
          <a href="#" className="navbar-brand">Hub Dashboard</a>
          <button className="navbar-toggler" data-toggle="collapse" data-target="#navbar">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav mr-auto">
              <NavLink to="/payments">
                Payments
              </NavLink>
              <NavLink to="/channels">
                Channels
              </NavLink>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item pull-right">
                <a className="nav-link" onClick={this.props.displayVynos}>Vynos</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  }
}

function mapStateToProps (state: State) {
  return {
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>) {
  return {
    displayVynos: () => dispatch(Ethereum.displayVynos({}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
