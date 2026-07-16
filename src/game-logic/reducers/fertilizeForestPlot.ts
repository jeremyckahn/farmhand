import { fieldMode, fertilizerType, itemType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

const { FERTILIZE, OBSERVE } = fieldMode

const fertilizerItemIdToTypeMap: Record<string, farmhand.fertilizerType> = {
  fertilizer: fertilizerType.STANDARD,
  'rainbow-fertilizer': fertilizerType.RAINBOW,
}

/**
 * Assumes that state.selectedItemId references an item with type ===
 * itemType.FERTILIZER.
 */
export const fertilizeForestPlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const { forest, selectedItemId } = state
  const row = forest[y]
  const plotContent = row?.[x]

  if (
    !plotContent ||
    !isPlantedTree(plotContent) ||
    itemsMap[selectedItemId]?.type !== itemType.FERTILIZER
  ) {
    return state
  }

  const fertilizerItemId = selectedItemId

  const fertilizerInventory = state.inventory.find(
    item => item.id === fertilizerItemId
  )

  if (
    !fertilizerInventory ||
    (plotContent.fertilizerType ?? fertilizerType.NONE) !== fertilizerType.NONE
  ) {
    return state
  }

  const { quantity: initialFertilizerQuantity } = fertilizerInventory

  state = decrementItemFromInventory(state, fertilizerItemId)
  const doFertilizersRemain = initialFertilizerQuantity > 1

  state = modifyForestPlotAt(state, x, y, tree => {
    if (!tree || !isPlantedTree(tree)) {
      return tree
    }

    return {
      ...tree,
      fertilizerType: fertilizerItemIdToTypeMap[fertilizerItemId],
    }
  })

  return {
    ...state,
    fieldMode: doFertilizersRemain ? FERTILIZE : OBSERVE,
    selectedItemId: doFertilizersRemain ? fertilizerItemId : '',
  }
}
