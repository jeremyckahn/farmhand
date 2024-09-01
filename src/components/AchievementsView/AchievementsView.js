import React from 'react'
import Accordion from '@mui/material/Accordion/index.js'
import AccordionSummary from '@mui/material/AccordionSummary/index.js'
import AccordionDetails from '@mui/material/AccordionDetails/index.js'
import { object } from 'prop-types'
import Divider from '@mui/material/Divider/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import ProgressBar from '../ProgressBar/index.js'
import Achievement from '../Achievement/index.js'
import achievements from '../../data/achievements.js'
import { memoize } from '../../utils/memoize.js'

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
