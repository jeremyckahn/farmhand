import React from 'react'

import FarmhandContext from '../../Farmhand.context'

import './AchievementsView.sass'

const AchievementsView = () => <div className="AchievementsView"></div>

AchievementsView.propTypes = {}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AchievementsView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
