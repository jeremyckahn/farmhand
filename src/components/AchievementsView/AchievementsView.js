import React from 'react'

import FarmhandContext from '../../Farmhand.context'
import Achievement from '../Achievement'
import achievements from '../../data/achievements'

import './AchievementsView.sass'

const AchievementsView = () => (
  <div className="AchievementsView">
    <ul className="card-list">
      {achievements.map(achievement => (
        <li {...{ key: achievement.id }}>
          <Achievement {...{ achievement }} />
        </li>
      ))}
    </ul>
  </div>
)

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
