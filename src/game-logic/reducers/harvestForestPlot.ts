import {
  cropLifeStage,
  toolLevel as toolLevelEnum,
  toolType,
} from '../../enums.js'
import { PICKER_POLE_LEVEL_TO_FRUIT_YIELD } from '../../constants.js'
import { itemsMap } from '../../data/maps.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'
import { inventorySpaceRemaining } from '../../utils/inventorySpaceRemaining.js'

import { addItemToInventory } from './addItemToInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

const { GROWN } = cropLifeStage
const { UNAVAILABLE } = toolLevelEnum

export const harvestForestPlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const row = state.forest[y]
  const plotContent = row?.[x]

  if (!plotContent || !('itemId' in plotContent)) return state
  if (state.toolLevels[toolType.PICKER_POLE] === UNAVAILABLE) return state
  if (!doesInventorySpaceRemain(state)) return state
  if (getFruitLifeStage(plotContent) !== GROWN) return state

  const item = itemsMap[plotContent.itemId]

  if (!item) return state

  const fruitYield =
    PICKER_POLE_LEVEL_TO_FRUIT_YIELD[state.toolLevels[toolType.PICKER_POLE]] ??
    1

  // Cap the counted yield to the space actually available so
  // treeFruitsHarvested reflects fruit the player received, not fruit that
  // addItemToInventory silently dropped because the inventory was nearly full.
  const receivedFruitYield = Math.min(
    fruitYield,
    inventorySpaceRemaining(state)
  )

  state = addItemToInventory(state, item, fruitYield)

  state = {
    ...state,
    treeFruitsHarvested: {
      ...state.treeFruitsHarvested,
      [item.id]:
        (state.treeFruitsHarvested[item.id] || 0) + receivedFruitYield,
    },
  }

  // Picking fruit only resets the fruit cycle — the tree itself stays at
  // its permanent grown state. Chopping the tree down entirely is a
  // separate axe interaction (see chopForestPlot.ts).
  return modifyForestPlotAt(state, x, y, current =>
    current && 'itemId' in current
      ? { ...current, daysSinceLastHarvest: 0 }
      : current
  )
}
