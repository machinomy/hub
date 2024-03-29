import * as React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import State from '../state/State'
import Ethereum from '../state/Ethereum'
import { ActionCreator, Dispatch } from 'redux'
import styled from 'react-emotion'

const NavLink = ({ to, children }: { to: string, children: any }) => {
  let child = (p: { match: boolean }) => {
    const classNames = `nav-item ${p.match ? 'active' : ''}`
    return (
      <li className={classNames}>
        <Link to={to} className="nav-link">{children}</Link>
      </li>
    )
  }
  return <Route path={to} exact={true} children={child} />
}

const VynosLink = styled('a')`
  cursor: pointer;
`

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
          <Link to="/" className="navbar-brand">Hub Dashboard</Link>
          <button className="navbar-toggler" data-toggle="collapse" data-target="#navbar">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav mr-auto">
              <NavLink to="/channels">
                Channels
              </NavLink>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item pull-right">
                <VynosLink className="nav-link" onClick={this.props.displayVynos}>Vynos</VynosLink>
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
