import React, { useState } from 'react'
import { bool, func } from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'
import FileReaderInput from 'react-file-reader-input'

import FarmhandContext from '../../Farmhand.context'

import './SettingsView.sass'

const SettingsView = ({
  handleClearPersistedDataClick,
  handleExportDataClick,
  handleImportDataClick,
  handleSaveButtonClick,
  handleShowNotificationsChange,
  handleUseAlternateEndDayButtonPositionChange,
  showNotifications,
  useAlternateEndDayButtonPosition,
}) => {
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false)

  return (
    <div className="SettingsView">
      <div className="button-row">
        <Button
          {...{
            color: 'primary',
            onClick: handleSaveButtonClick,
            variant: 'contained',
          }}
        >
          Save Game
        </Button>
      </div>
      <Divider />

      <FormControl component="fieldset">
        <FormLabel component="legend">Options</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={useAlternateEndDayButtonPosition}
                onChange={handleUseAlternateEndDayButtonPositionChange}
                name="use-alternate-end-day-button-position"
              />
            }
            label="Use alternate position for Bed button"
          />
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={showNotifications}
                onChange={handleShowNotificationsChange}
                name="show-notifications"
              />
            }
            label="Show new notifications"
          />
        </FormGroup>
      </FormControl>

      <Divider />
      <div className="button-row">
        <Tooltip
          {...{
            arrow: true,
            placement: 'top',
            title: 'Save your game data as a file on your device',
          }}
        >
          <Button
            {...{
              color: 'primary',
              onClick: handleExportDataClick,
              variant: 'contained',
            }}
          >
            Export Game Data
          </Button>
        </Tooltip>
        <FileReaderInput
          {...{
            as: 'text',
            onChange: (e, results) => {
              handleImportDataClick(results)
            },
          }}
        >
          <Tooltip
            {...{
              arrow: true,
              placement: 'top',
              title: 'Load game data that was previously saved',
            }}
          >
            <Button {...{ color: 'primary', variant: 'contained' }}>
              Import Game Data
            </Button>
          </Tooltip>
        </FileReaderInput>
      </div>
      <Divider />
      <div className="button-row">
        <Button
          {...{
            color: 'primary',
            onClick: () => setIsClearDataDialogOpen(true),
            variant: 'contained',
          }}
        >
          Delete Game Data
        </Button>
      </div>

      <Dialog
        {...{
          className: 'Farmhand',
          open: isClearDataDialogOpen,
          onClose: () => setIsClearDataDialogOpen(false),
          maxWidth: 'xs',
        }}
      >
        <DialogTitle>Delete game data?</DialogTitle>
        <DialogContent dividers>
          <p>
            Are you sure that you want to delete your game data? This can't be
            undone. You may want to export your game data first.
          </p>
          <DialogActions>
            <Button
              autoFocus
              {...{
                color: 'primary',
                onClick: () => setIsClearDataDialogOpen(false),
              }}
            >
              Cancel
            </Button>
            <Button
              {...{
                color: 'secondary',
                onClick: () => {
                  handleClearPersistedDataClick()
                  setIsClearDataDialogOpen(false)
                },
              }}
            >
              Do it
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  )
}

SettingsView.propTypes = {
  handleClearPersistedDataClick: func.isRequired,
  handleExportDataClick: func.isRequired,
  handleImportDataClick: func.isRequired,
  handleSaveButtonClick: func.isRequired,
  handleShowNotificationsChange: func.isRequired,
  handleUseAlternateEndDayButtonPositionChange: func.isRequired,
  showNotifications: bool.isRequired,
  useAlternateEndDayButtonPosition: bool.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <SettingsView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
