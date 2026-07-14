import { getFinalCropItemIdFromSeedItemId } from '../../utils/getFinalCropItemIdFromSeedItemId.js'

import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { modifyForestPlotAt } from './modifyForestPlotAt.js'

export const plantTreeInPlot = (
  state: farmhand.state,
  x: number,
  y: number,
  saplingItemId: string
): farmhand.state => {
  if (
    !saplingItemId ||
    !state.inventory.some(({ id }) => id === saplingItemId)
  ) {
    return state
  }

  const row = state.forest[y]

  if (!row || row[x]) {
    // Out of bounds, or something is already planted at forest[y][x].
    return state
  }

  const finalTreeItemId = getFinalCropItemIdFromSeedItemId(saplingItemId)

  if (!finalTreeItemId) {
    return state
  }

  state = modifyForestPlotAt(state, x, y, () => ({
    itemId: finalTreeItemId,
    daysOld: 0,
    daysSinceLastHarvest: 0,
  }))

  state = decrementItemFromInventory(state, saplingItemId)

  return {
    ...state,
    selectedForestItemId: state.inventory.find(({ id }) => id === saplingItemId)
      ? saplingItemId
      : '',
  }
}
