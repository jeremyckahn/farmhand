import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './OnlinePeersView.sass'

const OnlinePeersView = () => <div {...{ className: 'OnlinePeersView' }}></div>

OnlinePeersView.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <OnlinePeersView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
