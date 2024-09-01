/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} farmhand.state */

import {
  chooseRandomIndex,
  getCropFromItemId,
  getFinalCropItemIdFromSeedItemId,
} from '../../utils/index.js'
import { itemsMap } from '../../data/maps.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { processSprinklers } from './processSprinklers.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @param {string} plantableItemId
 * @returns {farmhand.state}
 */
export const plantInPlot = (state, x, y, plantableItemId) => {
  if (
    !plantableItemId ||
    !state.inventory.some(({ id }) => id === plantableItemId)
  ) {
    return state
  }

  const { field } = state
  const row = field[y]

  if (row[x]) {
    // Something is already planted in field[x][y]
    return state
  }

  const { growsInto } = itemsMap[plantableItemId]

  const variationIdx = Array.isArray(growsInto)
    ? chooseRandomIndex(growsInto)
    : 0

  const finalCropItemId = getFinalCropItemIdFromSeedItemId(
    plantableItemId,
    variationIdx
  )

  state = modifyFieldPlotAt(state, x, y, () =>
    getCropFromItemId(finalCropItemId)
  )

  state = decrementItemFromInventory(state, plantableItemId)
  state = processSprinklers(state)

  return {
    ...state,
    selectedItemId: state.inventory.find(({ id }) => id === plantableItemId)
      ? plantableItemId
      : '',
  }
}
