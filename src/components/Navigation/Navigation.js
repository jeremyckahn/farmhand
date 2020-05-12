import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import Fab from '@material-ui/core/Fab'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import HistoryIcon from '@material-ui/icons/History'
import Tooltip from '@material-ui/core/Tooltip'
import { number, func, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import { dialogView, stageFocusType } from '../../enums'

import LogView from '../LogView'

import './Navigation.sass'

const dialogTitleMap = {
  [dialogView.FARMERS_LOG]: "Farmer's Log",
}

const dialogContentMap = {
  [dialogView.FARMERS_LOG]: <LogView />,
}

export const Navigation = ({
  currentDialogView,
  dayCount,
  handleClickDialogViewButton,
  handleCloseDialogView,
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
    <Dialog
      open={currentDialogView !== dialogView.NONE}
      onClose={handleCloseDialogView}
    >
      <MuiDialogTitle>{dialogTitleMap[currentDialogView]}</MuiDialogTitle>
      <MuiDialogContent>{dialogContentMap[currentDialogView]}</MuiDialogContent>
    </Dialog>
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
  handleClickDialogViewButton: func.isRequired,
  handleCloseDialogView: func.isRequired,
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
