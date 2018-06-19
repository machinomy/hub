import * as React from 'react'
import { Route } from 'react-router'
import { Link } from 'react-router-dom'

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

export default class Navbar extends React.Component {
  render () {
    let navStyle = {
      borderBottom: '1px solid #de5080'
    }
    return (
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
          </div>
        </div>
      </nav>
    )
  }
}
