import React, { useRef, useState } from 'react'
import Button from '@mui/material/Button/index.js'
import Dialog from '@mui/material/Dialog/index.js'
import DialogActions from '@mui/material/DialogActions/index.js'
import DialogContent from '@mui/material/DialogContent/index.js'
import DialogTitle from '@mui/material/DialogTitle/index.js'
import Divider from '@mui/material/Divider/index.js'
import FormControl from '@mui/material/FormControl/index.js'
import FormControlLabel from '@mui/material/FormControlLabel/index.js'
import FormGroup from '@mui/material/FormGroup/index.js'
import FormLabel from '@mui/material/FormLabel/index.js'
import Switch from '@mui/material/Switch/index.js'
import Slider from '@mui/material/Slider/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { Div } from '../Elements/index.js'
import {
  NOTIFICATION_DURATION_MAX,
  NOTIFICATION_DURATION_MIN,
} from '../../constants.js'

import { RandomSeedInput } from './RandomSeedInput.js'

const SettingsView = ({
  allowCustomPeerCowNames,
  handleAllowCustomPeerCowNamesChange,
  handleClearPersistedDataClick,
  handleExportDataClick,
  handleImportDataClick,
  handleSaveButtonClick,
  handleNotificationDurationChange,
  handleShowNotificationsChange,
  handleUseAlternateEndDayButtonPositionChange,
  handleShowHomeScreenChange,
  showNotifications,
  notificationDuration,
  useAlternateEndDayButtonPosition,
  showHomeScreen,
}: {
  allowCustomPeerCowNames: boolean
  handleAllowCustomPeerCowNamesChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleClearPersistedDataClick: () => void
  handleExportDataClick: () => void
  handleImportDataClick: (results: any) => void
  handleSaveButtonClick: () => void
  handleNotificationDurationChange: (
    event: React.SyntheticEvent | Event,
    value: number | number[]
  ) => void
  handleShowNotificationsChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleUseAlternateEndDayButtonPositionChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleShowHomeScreenChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  showNotifications: boolean
  notificationDuration: number
  useAlternateEndDayButtonPosition: boolean
  showHomeScreen: boolean
}) => {
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false)
  const importFileInputRef = useRef<HTMLInputElement>(null)

  const handleImportFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [file] = Array.from(event.target.files ?? [])

    // Cleared so that re-selecting the same file still fires onChange.
    event.target.value = ''

    if (file) {
      // handleImportDataClick expects [[readResult, file]] tuples (the shape
      // react-file-reader-input used to provide), but only uses the file.
      handleImportDataClick([[null, file]])
    }
  }

  return (
    <Div
      className="SettingsView"
      sx={{
        '& button': { margin: '0.5em' },
        '& fieldset': { display: 'block', margin: '0 auto', maxWidth: 400 },
        '& .button-row': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        '& .MuiFormControlLabel-root': { margin: '0.5em 0' },
      }}
    >
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
          <FormLabel component="legend">Notification display time</FormLabel>
          <Slider
            aria-label="Notification display time"
            marks
            min={NOTIFICATION_DURATION_MIN / 1000}
            max={NOTIFICATION_DURATION_MAX / 1000}
            onChange={handleNotificationDurationChange}
            sx={{ margin: '0 auto', width: '90%' }}
            value={notificationDuration / 1000}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${value} seconds`}
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
        <input
          ref={importFileInputRef}
          type="file"
          hidden
          onChange={handleImportFileChange}
        />
        <Tooltip
          {...{
            arrow: true,
            placement: 'top',
            title: 'Load game data that was previously saved',
          }}
        >
          <Button
            {...{
              color: 'primary',
              onClick: () => importFileInputRef.current?.click(),
              variant: 'contained',
            }}
          >
            Import Game Data
          </Button>
        </Tooltip>
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
    </Div>
  )
}

export { SettingsView }

export default function Consumer(
  props: Partial<Parameters<typeof SettingsView>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <SettingsView
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof SettingsView>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
