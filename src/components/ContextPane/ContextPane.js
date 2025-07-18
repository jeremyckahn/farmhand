import React, { memo } from 'react'
import { array, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Inventory from '../Inventory/index.js'
import CowPenContextMenu from '../CowPenContextMenu/index.js'
import { stageFocusType } from '../../enums.js'

import './ContextPane.sass'

export const PlayerInventory = memo(
  /**
   * Renders an Inventory component with player's items and sell view enabled.
   *
   * @param {Object} props - The component props.
   * @param {farmhand.item[]} props.playerInventory - The array of items in the
   * player's inventory.
   */
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

export const ContextPane = ({ playerInventory, stageFocus }) => {
  return (
    <div className="ContextPane">
      {stageFocus === stageFocusType.COW_PEN ? (
        <CowPenContextMenu />
      ) : (
        <>
          <h2>Inventory</h2>
          {/*
          // NOTE: Weird ignore comment syntax and formatting is needed here.
          // See: https://stackoverflow.com/a/56913087/470685 */}
          <PlayerInventory
            {...{
              playerInventory,
            }}
          />
        </>
      )}
    </div>
  )
}

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
