import React from 'react'
import { func } from 'prop-types'
import Button from '@material-ui/core/Button'
import FileReaderInput from 'react-file-reader-input'

import FarmhandContext from '../../Farmhand.context'

import './SettingsView.sass'

const SettingsView = ({ handleExportDataClick, handleImportDataClick }) => {
  return (
    <div className="SettingsView">
      <Button
        color="primary"
        onClick={handleExportDataClick}
        variant="contained"
      >
        Export data
      </Button>
      <FileReaderInput
        {...{
          as: 'text',
          onChange: (e, results) => {
            handleImportDataClick(results)
          },
        }}
      >
        <Button color="primary" variant="contained">
          Import data
        </Button>
      </FileReaderInput>
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
