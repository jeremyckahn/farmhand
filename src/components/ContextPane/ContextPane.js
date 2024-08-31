import React, { memo } from 'react'
import { array, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Inventory from '../Inventory/index.js'
import CowPenContextMenu from '../CowPenContextMenu/index.js'
import { stageFocusType } from '../../enums.js'

import './ContextPane.sass'

export const PlayerInventory = memo(
  ({ playerInventory }) => (
    <Inventory
      {...{
        items: playerInventory,
        isSellView: true,
      }}
    />
  ),
  (prev, next) => prev.playerInventory === next.playerInventory
)

export const ContextPane = ({ playerInventory, stageFocus }) => (
  <div className="ContextPane">
    {stageFocus === stageFocusType.COW_PEN ? (
      <CowPenContextMenu />
    ) : (
      <>
        <h2>Inventory</h2>
        <PlayerInventory
          {...{
            playerInventory,
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
