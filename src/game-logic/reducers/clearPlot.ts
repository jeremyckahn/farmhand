import { cropLifeStage, itemType, toolType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import {
  doesInventorySpaceRemain,
  getCropLifeStage,
  getPlotContentType,
  getSeedItemIdFromFinalStageCropItemId,
} from '../../utils/index.js'
import { HOE_LEVEL_TO_SEED_RECLAIM_RATE } from '../../constants.js'
import { randomNumberService } from '../../common/services/randomNumber.js'

import { addItemToInventory } from './addItemToInventory.js'
import { removeFieldPlotAt } from './removeFieldPlotAt.js'

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
    randomNumberService.isRandomNumberLessThan(
      HOE_LEVEL_TO_SEED_RECLAIM_RATE[hoeLevel]
    )
  ) {
    const seedId = getSeedItemIdFromFinalStageCropItemId(plotContent.itemId)
    state = addItemToInventory(state, itemsMap[seedId])
  }

  const item = itemsMap[plotContent.itemId]

  if (item.isReplantable && !doesInventorySpaceRemain(state)) {
    return state
  }

  state = removeFieldPlotAt(state, x, y)

  const shouldAddItemToInventory =
    item.isReplantable ||
    getPlotContentType(plotContent) === itemType.WEED ||
    getCropLifeStage(plotContent) === GROWN

  return shouldAddItemToInventory ? addItemToInventory(state, item) : state
}
