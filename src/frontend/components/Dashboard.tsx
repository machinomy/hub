import * as React from 'react'

export default class Dashboard extends React.Component {
  render () {
    return <div id="app">
      Dashboard
      <div>
        {this.props.children}
      </div>
    </div>
  }
}
