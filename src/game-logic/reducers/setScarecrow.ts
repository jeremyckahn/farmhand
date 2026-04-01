import { fieldMode } from '../../enums.js'
import { getPlotContentFromItemId } from '../../utils/index.js'
import { SCARECROW_ITEM_ID } from '../../constants.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

const { OBSERVE, SET_SCARECROW } = fieldMode

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const setScarecrow = (state, x, y) => {
  const plot = state.field[y][x]

  // Only set scarecrows in empty plots
  if (plot !== null) {
    return state
  }

  state = decrementItemFromInventory(state, SCARECROW_ITEM_ID)

  const doScarecrowsRemain = state.inventory.some(
    item => item.id === SCARECROW_ITEM_ID
  )

  state = modifyFieldPlotAt(state, x, y, () =>
    getPlotContentFromItemId(SCARECROW_ITEM_ID)
  )

  return {
    ...state,
    fieldMode: doScarecrowsRemain ? SET_SCARECROW : OBSERVE,
    selectedItemId: doScarecrowsRemain ? SCARECROW_ITEM_ID : '',
  }
}
