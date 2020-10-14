import React from 'react'
import { object, number } from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'

import FarmhandContext from '../../Farmhand.context'
import {
  farmProductSalesVolumeNeededForLevel,
  farmProductsSold,
  integerString,
  levelAchieved,
  moneyString,
} from '../../utils'
import { FARM_PRODUCTS_TOOLTIP_TEXT } from '../../strings'

import './StatsView.sass'

const StatsView = ({
  itemsSold,
  revenue,
  todaysRevenue,

  totalFarmProductsSold = farmProductsSold(itemsSold),
  currentLevel = levelAchieved(totalFarmProductsSold),
}) => (
  <div className="StatsView">
    <TableContainer {...{ component: Paper }}>
      <Table aria-label="Financial Stats">
        <TableBody>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Farmer Level
            </TableCell>
            <TableCell align="right">{integerString(currentLevel)}</TableCell>
          </TableRow>
          <Tooltip
            {...{
              arrow: true,
              placement: 'top',
              title: FARM_PRODUCTS_TOOLTIP_TEXT,
            }}
          >
            <TableRow>
              <TableCell {...{ component: 'th', scope: 'row' }}>
                Farm Products Sold
              </TableCell>
              <TableCell align="right">
                {integerString(totalFarmProductsSold)}
              </TableCell>
            </TableRow>
          </Tooltip>
          <Tooltip
            {...{
              arrow: true,
              placement: 'top',
              title: FARM_PRODUCTS_TOOLTIP_TEXT,
            }}
          >
            <TableRow>
              <TableCell {...{ component: 'th', scope: 'row' }}>
                Sales Needed for Next Level
              </TableCell>
              <TableCell align="right">
                {integerString(
                  farmProductSalesVolumeNeededForLevel(currentLevel + 1) -
                    totalFarmProductsSold
                )}
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Today's Revenue
            </TableCell>
            <TableCell align="right">{moneyString(todaysRevenue)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              All-time Revenue
            </TableCell>
            <TableCell align="right">{moneyString(revenue)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

StatsView.propTypes = {
  itemsSold: object.isRequired,
  revenue: number.isRequired,
  todaysRevenue: number.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <StatsView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
