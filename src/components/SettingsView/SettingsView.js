import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './SettingsView.sass'

const SettingsView = () => {
  return <div className="SettingsView"></div>
}

SettingsView.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <SettingsView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
