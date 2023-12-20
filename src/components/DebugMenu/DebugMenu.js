import React from 'react'
import { func } from 'prop-types'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'

import { carrot } from '../../data/items'

import FarmhandContext from '../Farmhand/Farmhand.context'

import './DebugMenu.sass'

export const DebugMenu = ({ handleAddMoneyClick, handleItemPurchaseClick }) => (
  <Accordion className="DebugMenu" square={true}>
    <AccordionSummary>
      <h2>Debug Menu</h2>
    </AccordionSummary>
    <AccordionDetails>
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
    </AccordionDetails>
  </Accordion>
)

DebugMenu.propTypes = {
  handleAddMoneyClick: func.isRequired,
  handleItemPurchaseClick: func.isRequired,
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
