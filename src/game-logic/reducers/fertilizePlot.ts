import { fieldMode, fertilizerType, itemType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { getPlotContentType } from '../../utils/index.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

const { FERTILIZE, OBSERVE } = fieldMode

const fertilizerItemIdToTypeMap = {
  [itemsMap['fertilizer'].id]: fertilizerType.STANDARD,
  [itemsMap['rainbow-fertilizer'].id]: fertilizerType.RAINBOW,
}

/**
 * Assumes that state.selectedItemId references an item with type ===
 * itemType.FERTILIZER.
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const fertilizePlot = (state, x, y) => {
  const { field, selectedItemId } = state
  const row = field[y]
  const plotContent = row[x]

  if (!plotContent || itemsMap[selectedItemId]?.type !== itemType.FERTILIZER) {
    return state
  }

  const { id: fertilizerItemId } = itemsMap[selectedItemId]

  const fertilizerInventory = state.inventory.find(
    item => item.id === fertilizerItemId
  )

  const plotContentType = getPlotContentType(plotContent)

  if (
    !plotContent ||
    !fertilizerInventory ||
    plotContent.fertilizerType !== fertilizerType.NONE ||
    (selectedItemId === 'fertilizer' && plotContentType !== itemType.CROP) ||
    (selectedItemId === 'rainbow-fertilizer' &&
      plotContentType !== itemType.CROP &&
      plotContentType !== itemType.SCARECROW)
  ) {
    return state
  }

  const { quantity: initialFertilizerQuantity } = fertilizerInventory
  state = decrementItemFromInventory(state, fertilizerItemId)
  const doFertilizersRemain = initialFertilizerQuantity > 1

  state = modifyFieldPlotAt(state, x, y, crop => {
    if (!crop) {
      return crop
    }

    return {
      ...crop,
      fertilizerType: fertilizerItemIdToTypeMap[fertilizerItemId],
    }
  })

  return {
    ...state,
    fieldMode: doFertilizersRemain ? FERTILIZE : OBSERVE,
    selectedItemId: doFertilizersRemain ? fertilizerItemId : '',
  }
}
