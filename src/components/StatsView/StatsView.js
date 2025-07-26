import React from 'react'
import { array, object, number, string } from 'prop-types'
import classNames from 'classnames'
import Table from '@mui/material/Table/index.js'
import TableBody from '@mui/material/TableBody/index.js'
import TableCell from '@mui/material/TableCell/index.js'
import TableContainer from '@mui/material/TableContainer/index.js'
import TableRow from '@mui/material/TableRow/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Paper from '@mui/material/Paper/index.js'
import sortBy from 'lodash.sortby'

import { itemsMap } from '../../data/maps.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { moneyString } from '../../utils/moneyString.js'
import { farmProductsSold } from '../../utils/farmProductsSold.js'
import { levelAchieved } from '../../utils/levelAchieved.js'
import {
  experienceNeededForLevel,
  get7DayAverage,
  getProfit,
  getProfitRecord,
  integerString,
  moneyTotal,
} from '../../utils/index.js'
import {
  COW_SOLD_TOOLTIP_TEXT,
  FARM_PRODUCTS_TOOLTIP_TEXT,
} from '../../strings.js'
import { DAILY_FINANCIAL_HISTORY_RECORD_LENGTH } from '../../constants.js'

import './StatsView.sass'

const ElevatedPaper = props => (
  <Paper {...{ ...props, elevation: 6 }}>{props.children}</Paper>
)

const StatsView = (
  /**
   * @type {farmhand.state &
   *   {totalFarmProductsSold?: number, currentLevel?: number}
   * }
   */
  {
    cowsTraded,
    experience,
    farmName,
    historicalDailyLosses,
    historicalDailyRevenue,
    itemsSold,
    loansTakenOut,
    profitabilityStreak,
    record7dayProfitAverage,
    recordProfitabilityStreak,
    recordSingleDayProfit,
    revenue,
    todaysLosses,
    todaysRevenue,

    totalFarmProductsSold = farmProductsSold(itemsSold),
    currentLevel = levelAchieved(experience),
  }
) => (
  <div className="StatsView">
    <TableContainer {...{ component: ElevatedPaper }}>
      <Table aria-label="Farmer Stats">
        <TableBody>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Farm Name
            </TableCell>
            <TableCell align="right">{farmName} Farm</TableCell>
          </TableRow>
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
                Experience Points Needed for Next Level
              </TableCell>
              <TableCell align="right">
                {integerString(
                  experienceNeededForLevel(currentLevel + 1) - experience
                )}
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Loans Taken Out
            </TableCell>
            <TableCell align="right">{integerString(loansTakenOut)}</TableCell>
          </TableRow>
          <Tooltip
            {...{
              arrow: true,
              placement: 'top',
              title: COW_SOLD_TOOLTIP_TEXT,
            }}
          >
            <TableRow>
              <TableCell {...{ component: 'th', scope: 'row' }}>
                Cows traded
              </TableCell>
              <TableCell align="right">{integerString(cowsTraded)}</TableCell>
            </TableRow>
          </Tooltip>
        </TableBody>
      </Table>
    </TableContainer>
    <h3>Financial Records</h3>
    <TableContainer {...{ component: ElevatedPaper }}>
      <Table aria-label="Profit and Loss Stats">
        <TableBody>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Today's Revenue
            </TableCell>
            <TableCell align="right">{moneyString(todaysRevenue)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Today's Losses
            </TableCell>
            <TableCell align="right">{moneyString(todaysLosses)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Today's Profit
            </TableCell>
            <TableCell
              {...{
                align: 'right',
                className: classNames({
                  'danger-text': Math.abs(todaysLosses) > todaysRevenue,
                }),
              }}
            >
              {moneyString(getProfit(todaysRevenue, todaysLosses))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Record Single Day Profit
            </TableCell>
            <TableCell
              {...{
                align: 'right',
              }}
            >
              {moneyString(
                getProfitRecord(
                  recordSingleDayProfit,
                  todaysRevenue,
                  todaysLosses
                )
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Current Profitability Streak
            </TableCell>
            <TableCell align="right">
              {profitabilityStreak} {profitabilityStreak === 1 ? 'day' : 'days'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Record Profitability Streak
            </TableCell>
            <TableCell align="right">
              {recordProfitabilityStreak}{' '}
              {recordProfitabilityStreak === 1 ? 'day' : 'days'}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              {DAILY_FINANCIAL_HISTORY_RECORD_LENGTH}-day Profit Average
            </TableCell>
            <TableCell align="right">
              {moneyString(
                get7DayAverage(
                  historicalDailyLosses.map((loss, i) =>
                    moneyTotal(historicalDailyRevenue[i], loss)
                  )
                )
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Record {DAILY_FINANCIAL_HISTORY_RECORD_LENGTH}-day Profit Average
            </TableCell>
            <TableCell align="right">
              {moneyString(record7dayProfitAverage)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              All-Time Total Revenue
            </TableCell>
            <TableCell align="right">{moneyString(revenue)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    {Object.keys(itemsSold).length > 0 && (
      <>
        <h3>Items Sold</h3>
        <TableContainer {...{ component: ElevatedPaper }}>
          <Table aria-label="Profit and Loss Stats">
            <TableBody>
              {sortBy(
                Object.entries(itemsSold),
                ([itemId]) => itemsMap[itemId].name
              ).map(([itemId, quantity]) => (
                <TableRow {...{ key: itemId }}>
                  <TableCell {...{ component: 'th', scope: 'row' }}>
                    {itemsMap[itemId].name}
                  </TableCell>
                  <TableCell align="right">
                    {integerString(quantity || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )}
  </div>
)

StatsView.propTypes = {
  cowsTraded: number.isRequired,
  farmName: string.isRequired,
  historicalDailyLosses: array.isRequired,
  historicalDailyRevenue: array.isRequired,
  itemsSold: object.isRequired,
  profitabilityStreak: number.isRequired,
  record7dayProfitAverage: number.isRequired,
  recordProfitabilityStreak: number.isRequired,
  revenue: number.isRequired,
  todaysLosses: number.isRequired,
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
