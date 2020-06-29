import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './StatsView.sass'

const StatsView = () => <div className="StatsView"></div>

StatsView.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <StatsView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
