import React from 'react'
import Fab from '@material-ui/core/Fab'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import HistoryIcon from '@material-ui/icons/History'
import Tooltip from '@material-ui/core/Tooltip'
import { number, func, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import { dialogView, stageFocusType } from '../../enums'

import './Navigation.sass'

export const Navigation = ({
  dayCount,
  handleClickDialogViewButton,
  handleViewChange,
  purchasedCowPen,
  stageFocus,
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <h2 className="day-count">Day {dayCount}</h2>
    <div className="button-array">
      <Tooltip
        {...{
          placement: 'bottom',
          title: "Open Farmer's Log",
        }}
      >
        <Fab
          {...{
            'aria-label': "Open Farmer's Log",
            className: 'view-log',
            color: 'primary',
            onClick: () => handleClickDialogViewButton(dialogView.FARMERS_LOG),
          }}
        >
          <HistoryIcon />
        </Fab>
      </Tooltip>
    </div>
    <Select
      {...{
        className: 'view-select',
        onChange: handleViewChange,
        value: stageFocus,
      }}
    >
      <MenuItem value={stageFocusType.HOME}>Home (h)</MenuItem>
      <MenuItem value={stageFocusType.FIELD}>Field (f)</MenuItem>
      <MenuItem value={stageFocusType.SHOP}>Shop (s)</MenuItem>
      {purchasedCowPen && (
        <MenuItem value={stageFocusType.COW_PEN}>Cows (c)</MenuItem>
      )}
      <MenuItem value={stageFocusType.KITCHEN}>Kitchen (k)</MenuItem>
      <MenuItem value={stageFocusType.INVENTORY}>Inventory (i)</MenuItem>
    </Select>
  </header>
)

Navigation.propTypes = {
  dayCount: number.isRequired,
  handleViewChange: func.isRequired,
  purchasedCowPen: number.isRequired,
  stageFocus: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Navigation {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
