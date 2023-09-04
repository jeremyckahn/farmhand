import React from 'react'
import { bool, number, object } from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { levelAchieved } from '../../utils/levelAchieved'
import {
  experienceNeededForLevel,
  integerString,
  scaleNumber,
} from '../../utils'

export function DayAndProgressContainer({
  dayCount,
  experience,
  features,
  itemsSold,
}) {
  const currentLevel = levelAchieved({ experience })

  const levelPercent = scaleNumber(
    experience,
    experienceNeededForLevel(currentLevel),
    experienceNeededForLevel(currentLevel + 1),
    0,
    100
  )

  const tooltipText = `${integerString(
    experienceNeededForLevel(currentLevel + 1) - experience
  )} more experience points needed to reach level ${integerString(
    currentLevel + 1
  )}`

  return (
    <h2 className="day-and-progress-container">
      <span>Day {integerString(dayCount)}, level:</span>
      <Tooltip
        {...{
          arrow: true,
          placement: 'top',
          title: tooltipText,
        }}
      >
        <Box>
          <CircularProgress
            {...{
              value: levelPercent,
              variant: 'determinate',
            }}
          />
          <span {...{ className: 'current-level' }}>
            {integerString(currentLevel)}
          </span>
        </Box>
      </Tooltip>
    </h2>
  )
}

DayAndProgressContainer.propTypes = {
  dayCount: number.isRequired,
  experience: number.isRequired,
  features: object.isRequired,
  itemsSold: object.isRequired,
  useLegacyLevelingSystem: bool.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <DayAndProgressContainer {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
