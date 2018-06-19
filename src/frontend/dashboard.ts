import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Application from './components/Application'

require('bootstrap/dist/css/bootstrap.css')
require('bootstrap/dist/js/bootstrap.bundle.js')
require('jquery/dist/jquery.js')

let element = React.createElement(Application)

let root = document.createElement('div')
root.setAttribute('id', 'root')
document.body.appendChild(root)

ReactDOM.render(element, root)
