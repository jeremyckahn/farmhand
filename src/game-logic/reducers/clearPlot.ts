import { cropLifeStage, itemType, toolType } from '../../enums.js'
import { itemsMap } from '../../data/maps.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { getCropLifeStage } from '../../utils/getCropLifeStage.js'
import { getPlotContentType } from '../../utils/getPlotContentType.js'
import { getSeedItemIdFromFinalStageCropItemId } from '../../utils/getSeedItemIdFromFinalStageCropItemId.js'
import { HOE_LEVEL_TO_SEED_RECLAIM_RATE } from '../../constants.js'
import { randomNumberService } from '../../common/services/randomNumber.js'

import { addItemToInventory } from './addItemToInventory.js'
import { applyDestructionYield } from './helpers.js'
import { removeFieldPlotAt } from './removeFieldPlotAt.js'

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

  // The Hoe can scrap a Lightning Rod, but it's never returned to
  // inventory intact (it isn't isReplantable, unlike Scarecrows) - its
  // accumulated damage lives on the plot itself, not the item, so there's
  // no sane inventory representation for a "used" rod. An undamaged rod
  // yields its destructionYield (the same materials a lightning strike
  // would refund); a damaged one is scrapped for nothing.
  if (getPlotContentType(plotContent) === itemType.LIGHTNING_ROD) {
    const item = itemsMap[plotContent.itemId]

    state = removeFieldPlotAt(state, x, y)

    return plotContent.lightningStrikesSustained
      ? state
      : applyDestructionYield(state, item)
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
