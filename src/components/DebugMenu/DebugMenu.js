import React from 'react'
import FileReaderInput from 'react-file-reader-input'
import { func } from 'prop-types'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Button from '@material-ui/core/Button'

import { carrot } from '../../data/items'

import FarmhandContext from '../../Farmhand.context'

import './DebugMenu.sass'

export const DebugMenu = ({
  handleAddMoneyClick,
  handleClearPersistedDataClick,
  handleItemPurchaseClick,
  handleLoadDataClick,
  handleSaveDataClick,
}) => (
  <ExpansionPanel className="DebugMenu" square={true}>
    <ExpansionPanelSummary>
      <h2>Debug Menu</h2>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Button
        color="primary"
        onClick={() => handleAddMoneyClick(10000)}
        variant="contained"
      >
        Get $10,000
      </Button>
      <Button
        color="primary"
        onClick={() => handleItemPurchaseClick(carrot, 10)}
        variant="contained"
      >
        Buy 10 carrots
      </Button>
      <Button color="primary" onClick={handleSaveDataClick} variant="contained">
        Save data
      </Button>
      <FileReaderInput
        {...{
          as: 'text',
          onChange: (e, results) => {
            handleLoadDataClick(results)
          },
        }}
      >
        <Button color="primary" variant="contained">
          Load data
        </Button>
      </FileReaderInput>
      <Button
        color="primary"
        onClick={handleClearPersistedDataClick}
        variant="contained"
      >
        Clear data
      </Button>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

DebugMenu.propTypes = {
  handleAddMoneyClick: func.isRequired,
  handleClearPersistedDataClick: func.isRequired,
  handleItemPurchaseClick: func.isRequired,
  handleLoadDataClick: func.isRequired,
  handleSaveDataClick: func.isRequired,
}

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <DebugMenu {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  )
}
