import {
  cropLifeStage,
  fertilizerType,
  itemType,
  toolLevel,
  toolType,
} from '../../enums'
import { itemsMap } from '../../data/maps'
import {
  doesInventorySpaceRemain,
  getCropLifeStage,
  getInventoryQuantityMap,
  getPlotContentType,
  getSeedItemIdFromFinalStageCropItemId,
} from '../../utils'

import { addItemToInventory } from './addItemToInventory'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'
import { removeFieldPlotAt } from './removeFieldPlotAt'
import { plantInPlot } from './plantInPlot'

const { GROWN } = cropLifeStage

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const harvestPlot = (state, x, y) => {
  const row = state.field[y]
  const crop = row[x]

  if (
    !crop ||
    getPlotContentType(crop) !== itemType.CROP ||
    getCropLifeStage(crop) !== GROWN ||
    !doesInventorySpaceRemain(state)
  ) {
    return state
  }

  const item = itemsMap[crop.itemId]
  const seedItemIdForCrop = getSeedItemIdFromFinalStageCropItemId(item.id)
  const plotWasRainbowFertilized =
    crop.fertilizerType === fertilizerType.RAINBOW

  let harvestedQuantity = 1

  switch (state.toolLevels[toolType.SCYTHE]) {
    case toolLevel.BRONZE:
      harvestedQuantity += 1
      break

    case toolLevel.IRON:
      harvestedQuantity += 2
      break

    case toolLevel.SILVER:
      harvestedQuantity += 3
      break

    case toolLevel.GOLD:
      harvestedQuantity += 4
      break

    default:
      harvestedQuantity = 1
  }

  state = removeFieldPlotAt(state, x, y)
  state = addItemToInventory(state, item, harvestedQuantity)

  const { cropType } = item

  if (plotWasRainbowFertilized) {
    const seedsForHarvestedCropAreAvailable =
      getInventoryQuantityMap(state.inventory)[seedItemIdForCrop] > 0

    if (seedsForHarvestedCropAreAvailable) {
      state = plantInPlot(state, x, y, seedItemIdForCrop)
      state = modifyFieldPlotAt(state, x, y, crop => ({
        ...crop,
        fertilizerType: fertilizerType.RAINBOW,
      }))
    }
  }

  const { cropsHarvested } = state

  return {
    ...state,
    cropsHarvested: {
      ...cropsHarvested,
      [cropType]: (cropsHarvested[cropType] || 0) + harvestedQuantity,
    },
  }
}
