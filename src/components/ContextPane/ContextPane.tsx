import React, { memo } from 'react'
import { array, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Inventory from '../Inventory/index.js'
import CowPenContextMenu from '../CowPenContextMenu/index.js'
import FarmhandShuffleContextMenu from '../FarmhandShuffleContextMenu/index.js'
import { stageFocusType } from '../../enums.js'
import { Div } from '../Elements/index.js'
import { centerTabsSx } from '../../styles/sx.js'

export const PlayerInventory = memo<{ playerInventory: farmhand.item[] }>(
  /**
   * Renders an Inventory component with player's items and sell view enabled.
   * @param props - The component props.
   * @param props.playerInventory - The array of items in the
player's inventory.
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

export const ContextPane = ({
  playerInventory,
  stageFocus,
}: {
  playerInventory: farmhand.item[]
  stageFocus: string
}) => {
  return (
    <Div
      className="ContextPane"
      sx={{
        ...centerTabsSx,
        margin: 0,
        '& h2': { margin: '0.5em 0 1em', textAlign: 'center' },
      }}
    >
      {stageFocus === stageFocusType.COW_PEN ? (
        <CowPenContextMenu />
      ) : stageFocus === stageFocusType.FARMHAND_SHUFFLE ? (
        <FarmhandShuffleContextMenu />
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
    </Div>
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
        <ContextPane
          {...({ ...gameState, ...handlers } as Parameters<
            typeof ContextPane
          >[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
