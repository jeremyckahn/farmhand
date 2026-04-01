import { fieldMode } from '../../enums.ts'
import { getPlotContentFromItemId } from '../../utils/index.tsx'
import { SPRINKLER_ITEM_ID } from '../../constants.ts'

import { decrementItemFromInventory } from './decrementItemFromInventory.ts'
import { processSprinklers } from './processSprinklers.ts'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.ts'

const { OBSERVE, SET_SPRINKLER } = fieldMode

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const setSprinkler = (state, x, y) => {
  const { field } = state
  const plot = field[y][x]

  // Only set sprinklers in empty plots
  if (plot !== null) {
    return state
  }

  state = decrementItemFromInventory(state, SPRINKLER_ITEM_ID)

  const doSprinklersRemain = state.inventory.some(
    item => item.id === SPRINKLER_ITEM_ID
  )

  state = modifyFieldPlotAt(state, x, y, () =>
    getPlotContentFromItemId(SPRINKLER_ITEM_ID)
  )

  state = processSprinklers(state)

  return {
    ...state,
    fieldMode: doSprinklersRemain ? SET_SPRINKLER : OBSERVE,
    selectedItemId: doSprinklersRemain ? SPRINKLER_ITEM_ID : '',
  }
}
