import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import { object } from 'prop-types'
import memoize from 'fast-memoize'
import Divider from '@material-ui/core/Divider'

import FarmhandContext from '../../Farmhand.context'
import Achievement from '../Achievement'
import achievements from '../../data/achievements'

import './AchievementsView.sass'

const partitionAchievements = memoize(completedAchievements =>
  achievements.reduce(
    (acc, achievement) => {
      acc[
        completedAchievements[achievement.id] ? 'complete' : 'incomplete'
      ].push(achievement)

      return acc
    },
    { complete: [], incomplete: [] }
  )
)

const AchievementsList = ({ achievements }) => (
  <ExpansionPanelDetails>
    <ul className="card-list">
      {achievements.map(achievement => (
        <li {...{ key: achievement.id }}>
          <Achievement {...{ achievement }} />
        </li>
      ))}
    </ul>
  </ExpansionPanelDetails>
)

const AchievementsView = ({
  completedAchievements,
  partitionedAchievements: { complete, incomplete } = partitionAchievements(
    completedAchievements
  ),
}) => (
  <div className="AchievementsView">
    {complete.length ? (
      <>
        <ExpansionPanel {...{ defaultExpanded: true }}>
          <ExpansionPanelSummary>
            <h3>Completed</h3>
          </ExpansionPanelSummary>
          <AchievementsList {...{ achievements: complete }} />
        </ExpansionPanel>
        <Divider />
      </>
    ) : null}
    <ExpansionPanel {...{ defaultExpanded: true }}>
      <ExpansionPanelSummary>
        <h3>Not Completed</h3>
      </ExpansionPanelSummary>
      <AchievementsList {...{ achievements: incomplete }} />
    </ExpansionPanel>
  </div>
)

AchievementsView.propTypes = {
  completedAchievements: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <AchievementsView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
