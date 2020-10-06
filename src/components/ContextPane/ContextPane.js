import React from 'react'
import { array, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import Inventory from '../Inventory'
import CowPenContextMenu from '../CowPenContextMenu'
import { stageFocusType } from '../../enums'

import './ContextPane.sass'

export const ContextPane = ({ playerInventory, stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.COW_PEN ? (
      <CowPenContextMenu />
    ) : (
      <>
        <h2>Inventory</h2>
        <Inventory
          {...{
            items: playerInventory,
          }}
        />
      </>
    )}
  </div>
)

ContextPane.propTypes = {
  playerInventory: array.isRequired,
  stageFocus: string.isRequired,
}

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <ContextPane {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  )
}
