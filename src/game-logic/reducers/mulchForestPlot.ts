import { fieldMode, fertilizerType, itemType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { isPlantedTree } from '../../utils/isPlantedTree.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

const { FERTILIZE, OBSERVE } = fieldMode

const mulchItemIdToTypeMap: Record<string, fertilizerType> = {
  mulch: fertilizerType.STANDARD,
  'rainbow-mulch': fertilizerType.RAINBOW,
}

/**
 * Assumes that state.selectedItemId references an item with type ===
 * itemType.MULCH.
 */
export const mulchForestPlot = (
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
    itemsMap[selectedItemId]?.type !== itemType.MULCH
  ) {
    return state
  }

  const mulchItemId = selectedItemId

  const mulchInventory = state.inventory.find(item => item.id === mulchItemId)

  if (
    !mulchInventory ||
    (plotContent.fertilizerType ?? fertilizerType.NONE) !== fertilizerType.NONE
  ) {
    return state
  }

  const { quantity: initialMulchQuantity } = mulchInventory

  state = decrementItemFromInventory(state, mulchItemId)
  const doesMulchRemain = initialMulchQuantity > 1

  state = {
    ...state,
    mulchApplied: {
      ...state.mulchApplied,
      [mulchItemId]: (state.mulchApplied[mulchItemId] || 0) + 1,
    },
  }

  state = modifyForestPlotAt(state, x, y, tree => {
    if (!tree || !isPlantedTree(tree)) {
      return tree
    }

    return {
      ...tree,
      fertilizerType: mulchItemIdToTypeMap[mulchItemId],
    }
  })

  return {
    ...state,
    fieldMode: doesMulchRemain ? FERTILIZE : OBSERVE,
    selectedItemId: doesMulchRemain ? mulchItemId : '',
  }
}
