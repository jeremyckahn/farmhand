import { fieldMode } from '../../enums.js'
import { getPlotContentFromItemId } from '../../utils/index.js'
import { SPRINKLER_ITEM_ID } from '../../constants.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { processSprinklers } from './processSprinklers.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

const { OBSERVE, SET_SPRINKLER } = fieldMode

export const setSprinkler = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
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
