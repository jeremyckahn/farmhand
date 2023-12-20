import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { object } from 'prop-types'
import Divider from '@mui/material/Divider'

import FarmhandContext from '../Farmhand/Farmhand.context'
import ProgressBar from '../ProgressBar'
import Achievement from '../Achievement'
import achievements from '../../data/achievements'
import { memoize } from '../../utils/memoize'

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
  <AccordionDetails>
    <ul className="card-list">
      {achievements.map(achievement => (
        <li {...{ key: achievement.id }}>
          <Achievement {...{ achievement }} />
        </li>
      ))}
    </ul>
  </AccordionDetails>
)

const AchievementsView = ({
  completedAchievements,
  partitionedAchievements: { complete, incomplete } = partitionAchievements(
    completedAchievements
  ),
}) => (
  <div className="AchievementsView">
    <ProgressBar
      {...{ percent: (complete.length / achievements.length) * 100 }}
    />
    {complete.length ? (
      <>
        <Accordion {...{ defaultExpanded: true }}>
          <AccordionSummary>
            <h3>Completed</h3>
          </AccordionSummary>
          <AchievementsList {...{ achievements: complete }} />
        </Accordion>
        <Divider />
      </>
    ) : null}
    <Accordion {...{ defaultExpanded: true }}>
      <AccordionSummary>
        <h3>Not Completed</h3>
      </AccordionSummary>
      <AchievementsList {...{ achievements: incomplete }} />
    </Accordion>
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
