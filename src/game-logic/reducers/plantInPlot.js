import {
  getCropFromItemId,
  getFinalCropItemIdFromSeedItemId,
} from '../../utils'

import { decrementItemFromInventory } from './decrementItemFromInventory'
import { processSprinklers } from './processSprinklers'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'

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
  const finalCropItemId = getFinalCropItemIdFromSeedItemId(plantableItemId)

  if (row[x]) {
    // Something is already planted in field[x][y]
    return state
  }

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
