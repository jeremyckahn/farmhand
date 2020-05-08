import React from 'react'
import { array } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'

import './LogView.sass'

const LogView = () => <div className="LogView"></div>

LogView.propTypes = {
  notificationLog: array.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <LogView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
