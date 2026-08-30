/**
 * @namespace farmhand
 */

import './polyfills.js'
import React from 'react'
// eslint-disable-next-line import/extensions -- react-dom's package.json exports map only exposes this subpath as "./client", not "./client.js"
import { createRoot } from 'react-dom/client'
import { HashRouter as Router, Route } from 'react-router-dom'

import Farmhand from './components/Farmhand/index.js'
import { features } from './config.js'
import '@fontsource/francois-one'
import '@fontsource/public-sans'

const FarmhandRoute = (props: any) => <Farmhand {...{ ...props, features }} />

const root = createRoot(document.getElementById('root')!)

root.render(
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
  </Router>
)
