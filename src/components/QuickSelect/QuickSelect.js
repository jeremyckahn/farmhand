import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './QuickSelect.sass'

const QuickSelect = () => <div className="QuickSelect"></div>

QuickSelect.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <QuickSelect {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
