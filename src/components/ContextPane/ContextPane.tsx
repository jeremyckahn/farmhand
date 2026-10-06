import React, { memo } from 'react'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Inventory from '../Inventory/index.js'
import CowPenContextMenu from '../CowPenContextMenu/index.js'
import FarmhandShuffleContextMenu from '../FarmhandShuffleContextMenu/index.js'
import { stageFocusType } from '../../enums.js'
import { Div, H3 } from '../Elements/index.js'
import { centerTabsSx } from '../../styles/sx.js'
import { colors } from '../../styles/tokens.js'

import { integerString } from '../../utils/integerString.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { inventorySpaceConsumed } from '../../utils/inventorySpaceConsumed.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

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
  inventory,
  inventoryLimit,
}: {
  playerInventory: farmhand.item[]
  stageFocus: string
  inventory: farmhand.state['inventory']
  inventoryLimit: number
}) => {
  const isInventoryFull = !doesInventorySpaceRemain({
    inventory,
    inventoryLimit,
  })

  return (
    <Div
      className="ContextPane"
      sx={{
        ...centerTabsSx,
        margin: 0,
        '& h2': { margin: '0.5em 0 1em', textAlign: 'center' },
        '& .inventory-info': { fontSize: '1em' },
        '& .inventory-title': { marginBottom: '0.5em' },
      }}
    >
      {stageFocus === stageFocusType.COW_PEN ? (
        <CowPenContextMenu />
      ) : stageFocus === stageFocusType.FARMHAND_SHUFFLE ? (
        <FarmhandShuffleContextMenu />
      ) : (
        <>
          <h2 className="inventory-title">Inventory</h2>

          {inventoryLimit > INFINITE_STORAGE_LIMIT && (
            <H3
              {...{
                className: classNames('inventory-info', {
                  'is-inventory-full': isInventoryFull,
                }),
              }}
              sx={{
                color: isInventoryFull ? colors.error : undefined,
                textAlign: 'center',
              }}
            >
              Capacity: {integerString(inventorySpaceConsumed(inventory))} /{' '}
              {integerString(inventoryLimit)}
            </H3>
          )}

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
