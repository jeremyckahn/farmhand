import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './PriceEventView.sass'

const PriceEventView = () => <div className="PriceEventView"></div>

PriceEventView.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <PriceEventView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
