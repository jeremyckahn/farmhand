import {
  cropLifeStage,
  fertilizerType,
  itemType,
  toolLevel,
  toolType,
} from '../../enums.ts'
import { itemsMap } from '../../data/maps.ts'
import {
  doesInventorySpaceRemain,
  getCropLifeStage,
  getPlotContentType,
  getSeedItemIdFromFinalStageCropItemId,
} from '../../utils/index.tsx'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap.ts'

import { addItemToInventory } from './addItemToInventory.ts'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.ts'
import { removeFieldPlotAt } from './removeFieldPlotAt.ts'
import { plantInPlot } from './plantInPlot.ts'

const { GROWN } = cropLifeStage

/**
 * @param {farmhand.state} state
 * @returns {number}
 */
function getHarvestedQuantity(state) {
  let amount = 1

  switch (state.toolLevels[toolType.SCYTHE]) {
    case toolLevel.BRONZE:
      amount += 1
      break

    case toolLevel.IRON:
      amount += 2
      break

    case toolLevel.SILVER:
      amount += 3
      break

    case toolLevel.GOLD:
      amount += 4
      break

    default:
      amount = 1
  }

  return amount
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
function harvestCrops(state, x, y) {
  const row = state.field[y]
  const crop = row[x]

  if (!crop) return state

  const item = itemsMap[crop.itemId]

  if (!item) return state

  const seedItemIdForCrop = getSeedItemIdFromFinalStageCropItemId(item.id)
  const plotWasRainbowFertilized =
    crop.fertilizerType === fertilizerType.RAINBOW

  const harvestedQuantity = getHarvestedQuantity(state)

  state = removeFieldPlotAt(state, x, y)
  state = addItemToInventory(state, item, harvestedQuantity)

  const { cropType } = item

  if (!cropType) return state

  if (plotWasRainbowFertilized) {
    const seedsForHarvestedCropAreAvailable =
      getInventoryQuantityMap(state.inventory)[seedItemIdForCrop] > 0

    if (seedsForHarvestedCropAreAvailable) {
      state = plantInPlot(state, x, y, seedItemIdForCrop)
      state = modifyFieldPlotAt(state, x, y, updatedCrop => {
        if (!updatedCrop) {
          return updatedCrop
        }

        return {
          ...updatedCrop,
          fertilizerType: fertilizerType.RAINBOW,
        }
      })
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

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
function harvestWeed(state, x, y) {
  const row = state.field[y]
  const crop = row[x]

  if (!crop) return state

  const item = itemsMap[crop.itemId]
  const harvestedQuantity = getHarvestedQuantity(state)

  state = removeFieldPlotAt(state, x, y)
  state = addItemToInventory(state, item, harvestedQuantity)

  return state
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const harvestPlot = (state, x, y) => {
  const row = state.field[y]
  const crop = row[x]

  if (!crop) return state
  if (!doesInventorySpaceRemain(state)) return state

  if (
    getPlotContentType(crop) === itemType.CROP &&
    getCropLifeStage(crop) === GROWN
  ) {
    return harvestCrops(state, x, y)
  } else if (getPlotContentType(crop) === itemType.WEED) {
    return harvestWeed(state, x, y)
  }

  return state
}
