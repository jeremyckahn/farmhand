import React from 'react'
import { number, object } from 'prop-types'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'

import { farmProductsSold } from '../../utils/farmProductsSold'
import { levelAchieved } from '../../utils/levelAchieved'
import {
  farmProductSalesVolumeNeededForLevel,
  integerString,
  scaleNumber,
} from '../../utils'

export function DayAndProgressContainer({ dayCount, itemsSold }) {
  const totalFarmProductsSold = farmProductsSold(itemsSold)
  const currentLevel = levelAchieved({ itemsSold })
  const levelPercent = scaleNumber(
    totalFarmProductsSold,
    farmProductSalesVolumeNeededForLevel(currentLevel),
    farmProductSalesVolumeNeededForLevel(currentLevel + 1),
    0,
    100
  )

  return (
    <h2 className="day-and-progress-container">
      <span>Day {integerString(dayCount)}, level:</span>
      <Tooltip
        {...{
          arrow: true,
          placement: 'top',
          title: `${integerString(
            farmProductSalesVolumeNeededForLevel(currentLevel + 1) -
              totalFarmProductsSold
          )} more sales needed for level ${integerString(currentLevel + 1)}`,
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
  itemsSold: object.isRequired,
}
