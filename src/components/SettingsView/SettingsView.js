import React, { useState } from 'react'
import { bool, func } from 'prop-types'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import FileReaderInput from 'react-file-reader-input'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { RandomSeedInput } from './RandomSeedInput'
import './SettingsView.sass'

const SettingsView = ({
  allowCustomPeerCowNames,
  handleAllowCustomPeerCowNamesChange,
  handleClearPersistedDataClick,
  handleExportDataClick,
  handleImportDataClick,
  handleSaveButtonClick,
  handleShowNotificationsChange,
  handleUseAlternateEndDayButtonPositionChange,
  handleShowHomeScreenChange,
  showNotifications,
  useAlternateEndDayButtonPosition,
  showHomeScreen,
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
      <RandomSeedInput />
      <Divider />

      <FormControl variant="standard" component="fieldset">
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
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={showHomeScreen}
                onChange={handleShowHomeScreenChange}
                name="show-home-screen"
              />
            }
            label="Show the Home Screen"
          />
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={allowCustomPeerCowNames}
                onChange={handleAllowCustomPeerCowNamesChange}
                name="allow-custom-peer-cow-names"
              />
            }
            label="Display custom names for cows received from other players"
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
                color: 'error',
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
  allowCustomPeerCowNames: bool.isRequired,
  handleAllowCustomPeerCowNamesChange: func.isRequired,
  handleClearPersistedDataClick: func.isRequired,
  handleExportDataClick: func.isRequired,
  handleImportDataClick: func.isRequired,
  handleSaveButtonClick: func.isRequired,
  handleShowHomeScreenChange: func.isRequired,
  handleShowNotificationsChange: func.isRequired,
  handleUseAlternateEndDayButtonPositionChange: func.isRequired,
  showHomeScreen: bool.isRequired,
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
