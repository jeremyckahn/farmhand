import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './Home.sass'

const Home = () => (
  <div className="Home">
    <h1>Welcome!</h1>
  </div>
)

Home.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Home {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
