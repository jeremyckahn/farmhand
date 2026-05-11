import {
  chooseRandomIndex,
  getCropFromItemId,
  getFinalCropItemIdFromSeedItemId,
} from '../../utils/index.js'
import { itemsMap } from '../../data/maps.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { processSprinklers } from './processSprinklers.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

export const plantInPlot = (
  state: farmhand.state,
  x: number,
  y: number,
  plantableItemId: string
): farmhand.state => {
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

  if (!finalCropItemId) {
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
