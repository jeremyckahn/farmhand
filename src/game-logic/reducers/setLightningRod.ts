import { fertilizerType, fieldMode } from '../../enums.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

const { OBSERVE, SET_LIGHTNING_ROD } = fieldMode

export const setLightningRod = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const plot = state.field[y][x]

  // Only set lightning rods in empty plots
  if (plot !== null) {
    return state
  }

  const { selectedItemId } = state

  state = decrementItemFromInventory(state, selectedItemId)

  const doLightningRodsRemain = state.inventory.some(
    item => item.id === selectedItemId
  )

  state = modifyFieldPlotAt(state, x, y, () => ({
    itemId: selectedItemId,
    fertilizerType: fertilizerType.NONE,
    lightningStrikesSustained: 0,
  }))

  return {
    ...state,
    fieldMode: doLightningRodsRemain ? SET_LIGHTNING_ROD : OBSERVE,
    selectedItemId: doLightningRodsRemain ? selectedItemId : '',
  }
}
