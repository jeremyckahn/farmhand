import React from 'react'
import { object } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'

import './Achievement.sass'

const Achievement = () => <div className="Achievement"></div>

Achievement.propTypes = {
  achievement: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Achievement {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
