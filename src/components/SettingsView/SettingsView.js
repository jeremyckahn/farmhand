import React from 'react'
import { func } from 'prop-types'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import FileReaderInput from 'react-file-reader-input'

import FarmhandContext from '../../Farmhand.context'

import './SettingsView.sass'

const SettingsView = ({ handleExportDataClick, handleImportDataClick }) => {
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
            color="primary"
            onClick={handleExportDataClick}
            variant="contained"
          >
            Export game data
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
            <Button color="primary" variant="contained">
              Import game data
            </Button>
          </Tooltip>
        </FileReaderInput>
      </div>
    </div>
  )
}

SettingsView.propTypes = {
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
