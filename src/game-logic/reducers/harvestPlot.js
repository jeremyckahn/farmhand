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

function harvestCrops(state, x, y) {
  const row = state.field[y]
  const crop = row[x]
  const item = itemsMap[crop.itemId]
  const seedItemIdForCrop = getSeedItemIdFromFinalStageCropItemId(item.id)
  const plotWasRainbowFertilized =
    crop.fertilizerType === fertilizerType.RAINBOW

  const harvestedQuantity = getHarvestedQuantity(state)

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

function harvestWeeds(state, x, y) {
  const row = state.field[y]
  const crop = row[x]
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

  if (
    getPlotContentType(crop) === itemType.CROP &&
    getCropLifeStage(crop) === GROWN &&
    doesInventorySpaceRemain(state)
  ) {
    return harvestCrops(state, x, y)
  } else if (getPlotContentType(crop) === itemType.WEEDS) {
    console.log('harvest weeds')
    return harvestWeeds(state, x, y)
  }

  return state
}
