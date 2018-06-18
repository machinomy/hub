import * as React from 'react'
import { hot } from 'react-hot-loader'

export class Dashboard extends React.Component {
  render () {
    return <div id="app">
      Dashboard
      <div>
        {this.props.children}
      </div>
    </div>
  }
}

export default hot(module)(Dashboard)
