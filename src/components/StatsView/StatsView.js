import React from 'react'
import { array, object, number, string } from 'prop-types'
import classNames from 'classnames'
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
  get7DayAverage,
  getProfit,
  getProfitRecord,
  integerString,
  levelAchieved,
  moneyString,
  moneyTotal,
} from '../../utils'
import { FARM_PRODUCTS_TOOLTIP_TEXT } from '../../strings'
import { DAILY_FINANCIAL_HISTORY_RECORD_LENGTH } from '../../constants'

import './StatsView.sass'

const ElevatedPaper = props => (
  <Paper {...{ ...props, elevation: 6 }}>{props.children}</Paper>
)

const StatsView = ({
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
  currentLevel = levelAchieved(totalFarmProductsSold),
}) => (
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
              Loans Taken Out
            </TableCell>
            <TableCell align="right">{integerString(loansTakenOut)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
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
  </div>
)

StatsView.propTypes = {
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
