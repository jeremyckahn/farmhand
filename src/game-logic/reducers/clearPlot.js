import { cropLifeStage, itemType, toolType } from '../../enums'
import { itemsMap } from '../../data/maps'
import {
  doesInventorySpaceRemain,
  getCropLifeStage,
  getPlotContentType,
  getSeedItemIdFromFinalStageCropItemId,
  isRandomNumberLessThan,
} from '../../utils'
import { HOE_LEVEL_TO_SEED_RECLAIM_RATE } from '../../constants'

import { addItemToInventory } from './addItemToInventory'

import { removeFieldPlotAt } from './removeFieldPlotAt'

const { GROWN } = cropLifeStage

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const clearPlot = (state, x, y) => {
  const plotContent = state.field[y][x]
  const hoeLevel = state.toolLevels[toolType.HOE]

  if (!plotContent || plotContent.isShoveled) {
    return state
  }

  if (
    getPlotContentType(plotContent) === itemType.CROP &&
    getCropLifeStage(plotContent) !== GROWN &&
    isRandomNumberLessThan(HOE_LEVEL_TO_SEED_RECLAIM_RATE[hoeLevel])
  ) {
    const seedId = getSeedItemIdFromFinalStageCropItemId(plotContent.itemId)
    state = addItemToInventory(state, itemsMap[seedId])
  }

  const item = itemsMap[plotContent.itemId]

  if (item.isReplantable && !doesInventorySpaceRemain(state)) {
    return state
  }

  state = removeFieldPlotAt(state, x, y)

  return item.isReplantable || getCropLifeStage(plotContent) === GROWN
    ? addItemToInventory(state, item)
    : state
}
