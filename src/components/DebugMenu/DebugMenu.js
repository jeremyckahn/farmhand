import React from 'react'
import { func } from 'prop-types'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Button from '@material-ui/core/Button'

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
