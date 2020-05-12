import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
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

const dialogTriggerTextMap = {
  [dialogView.FARMERS_LOG]: "Open Farmer's Log",
}

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
          title: dialogTriggerTextMap[dialogView.FARMERS_LOG],
        }}
      >
        <Fab
          {...{
            'aria-label': dialogTriggerTextMap[dialogView.FARMERS_LOG],
            className: 'view-log',
            color: 'primary',
            onClick: () => handleClickDialogViewButton(dialogView.FARMERS_LOG),
          }}
        >
          <HistoryIcon />
        </Fab>
      </Tooltip>
    </div>
    {/*
    This Dialog gets the Farmhand class because it renders outside of the root
    Farmhand component. This explicit class maintains style consistency.
    */}
    <Dialog
      {...{
        className: 'Farmhand',
        fullWidth: true,
        maxWidth: 'md',
        onClose: handleCloseDialogView,
        open: currentDialogView !== dialogView.NONE,
      }}
    >
      <DialogTitle>{dialogTitleMap[currentDialogView]}</DialogTitle>
      <DialogContent>{dialogContentMap[currentDialogView]}</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogView} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
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
