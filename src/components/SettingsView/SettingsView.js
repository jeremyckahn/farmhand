import React, { useState } from 'react'
import { func } from 'prop-types'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import FileReaderInput from 'react-file-reader-input'

import FarmhandContext from '../../Farmhand.context'

import './SettingsView.sass'

const SettingsView = ({
  handleClearPersistedDataClick,
  handleExportDataClick,
  handleImportDataClick,
}) => {
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false)

  return (
    <div className="SettingsView">
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
