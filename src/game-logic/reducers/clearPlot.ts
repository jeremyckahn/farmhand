import { cropLifeStage, itemType, toolType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { HOE_LEVEL_TO_SEED_RECLAIM_RATE } from '../../constants.js'
import { randomNumberService } from '../../common/services/randomNumber.js'

import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getCropLifeStage } from '../../utils/getCropLifeStage.js'
import { getPlotContentType } from '../../utils/getPlotContentType.js'
import { getSeedItemIdFromFinalStageCropItemId } from '../../utils/getSeedItemIdFromFinalStageCropItemId.js'

import { removeFieldPlotAt } from './removeFieldPlotAt.js'
import { addItemToInventory } from './addItemToInventory.js'

const { GROWN } = cropLifeStage

export const clearPlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const plotContent = state.field[y][x]
  const hoeLevel = state.toolLevels[toolType.HOE]

  if (!plotContent || plotContent.isShoveled) {
    return state
  }

  if (
    getPlotContentType(plotContent) === itemType.CROP &&
    getCropLifeStage(plotContent) !== GROWN &&
    randomNumberService.isRandomNumberLessThan(
      HOE_LEVEL_TO_SEED_RECLAIM_RATE[hoeLevel] || 0
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
