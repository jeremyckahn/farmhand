import { cropLifeStage } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getFruitLifeStage } from '../../utils/getFruitLifeStage.js'

import { addItemToInventory } from './addItemToInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

const { GROWN } = cropLifeStage

export const harvestForestPlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const row = state.forest[y]
  const plotContent = row?.[x]

  if (!plotContent || !('itemId' in plotContent)) return state
  if (!doesInventorySpaceRemain(state)) return state
  if (getFruitLifeStage(plotContent) !== GROWN) return state

  const item = itemsMap[plotContent.itemId]

  if (!item) return state

  state = addItemToInventory(state, item)

  // Picking fruit only resets the fruit cycle — the tree itself stays at
  // its permanent grown state. Chopping the tree down entirely is a
  // separate, future axe interaction.
  return modifyForestPlotAt(state, x, y, current =>
    current && 'itemId' in current
      ? { ...current, daysSinceLastHarvest: 0 }
      : current
  )
}
