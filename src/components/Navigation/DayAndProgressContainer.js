import React from 'react'
import { number, object } from 'prop-types'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { levelAchieved } from '../../utils/levelAchieved'
import {
  experienceNeededForLevel,
  integerString,
  scaleNumber,
} from '../../utils'

export function DayAndProgressContainer({ dayCount, experience, itemsSold }) {
  const currentLevel = levelAchieved(experience)

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
  itemsSold: object.isRequired,
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
