import React from 'react'
import { object, number } from 'prop-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import FarmhandContext from '../../Farmhand.context'
import {
  farmProductsSold,
  integerString,
  levelAchieved,
  moneyString,
} from '../../utils'

import './StatsView.sass'

const StatsView = ({
  itemsSold,
  revenue,

  totalFarmProductsSold = farmProductsSold(itemsSold),
}) => (
  <div className="StatsView">
    <TableContainer {...{ component: Paper }}>
      <Table aria-label="Financial Stats">
        <TableBody>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Farmer Level
            </TableCell>
            <TableCell align="right">
              {integerString(levelAchieved(totalFarmProductsSold))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Farm Products Sold
            </TableCell>
            <TableCell align="right">
              {integerString(totalFarmProductsSold)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...{ component: 'th', scope: 'row' }}>
              Revenue
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
