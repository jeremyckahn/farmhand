/**
 * @namespace farmhand
 */

import './polyfills.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'

import './index.sass'
import Farmhand from './components/Farmhand/index.js'
import { features } from './config.js'
import '@fontsource/francois-one'
import '@fontsource/public-sans'

// eslint-disable-next-line no-unused-vars
import { cropFamily, grapeVariety } from './enums.js'

const FarmhandRoute = props => <Farmhand {...{ ...props, features }} />

ReactDOM.render(
  <Router
    {...{
      hashType: 'noslash',
    }}
  >
    <Route
      {...{
        path: ['/online/:room', '/online', '/'],
        component: FarmhandRoute,
      }}
    />
  </Router>,
  document.getElementById('root')
)
