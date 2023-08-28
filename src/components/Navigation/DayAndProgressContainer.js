import React from 'react'
import { bool, number, object } from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { farmProductsSold } from '../../utils/farmProductsSold'
import { levelAchieved } from '../../utils/levelAchieved'
import {
  farmProductSalesVolumeNeededForLevel,
  experienceNeededForLevel,
  integerString,
  scaleNumber,
} from '../../utils'

export function DayAndProgressContainer({
  dayCount,
  experience,
  features,
  itemsSold,
  useLegacyLevelingSystem,
}) {
  const totalFarmProductsSold = farmProductsSold(itemsSold)
  const currentLevel = levelAchieved({
    itemsSold,
    experience,
    features,
    useLegacyLevelingSystem,
  })

  let levelPercent = 0
  let tooltipText = ''
  if (useLegacyLevelingSystem) {
    levelPercent = scaleNumber(
      totalFarmProductsSold,
      farmProductSalesVolumeNeededForLevel(currentLevel),
      farmProductSalesVolumeNeededForLevel(currentLevel + 1),
      0,
      100
    )

    tooltipText = `${integerString(
      farmProductSalesVolumeNeededForLevel(currentLevel + 1) -
        totalFarmProductsSold
    )} more sales needed for level ${integerString(currentLevel + 1)}`
  } else {
    levelPercent = scaleNumber(
      experience,
      experienceNeededForLevel(currentLevel),
      experienceNeededForLevel(currentLevel + 1),
      0,
      100
    )

    tooltipText = `${integerString(
      experienceNeededForLevel(currentLevel + 1) - experience
    )} more experience needed to reach level ${integerString(currentLevel + 1)}`
  }

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
