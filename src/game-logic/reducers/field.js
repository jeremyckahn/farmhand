import {
  cropLifeStage,
  fertilizerType,
  fieldMode,
  itemType,
  toolLevel,
  toolType,
} from '../../enums'
import { itemsMap } from '../../data/maps'
import {
  chooseRandom,
  doesInventorySpaceRemain,
  getCropLifeStage,
  getInventoryQuantityMap,
  getPlotContentFromItemId,
  getPlotContentType,
  getSeedItemIdFromFinalStageCropItemId,
  isRandomNumberLessThan,
} from '../../utils'
import {
  HOE_LEVEL_TO_SEED_RECLAIM_RATE,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
} from '../../constants'
import { INVENTORY_FULL_NOTIFICATION } from '../../strings'
import { ResourceFactory } from '../../factories'

import { updateField, resetWasWatered } from './helpers'

import { addItemToInventory } from './addItemToInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'
import { incrementPlotContentAge } from './incrementPlotContentAge'

import { resetWasShoveled } from './resetWasShoveled'
import { showNotification } from './showNotification'
import { processSprinklers } from './processSprinklers'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'
import { removeFieldPlotAt } from './removeFieldPlotAt'
import { plantInPlot } from './plantInPlot'

const { FERTILIZE, OBSERVE, SET_SCARECROW, SET_SPRINKLER } = fieldMode
const { GROWN } = cropLifeStage

const fertilizerItemIdToTypeMap = {
  [itemsMap['fertilizer'].id]: fertilizerType.STANDARD,
  [itemsMap['rainbow-fertilizer'].id]: fertilizerType.RAINBOW,
}

/**
 * Assumes that state.selectedItemId references an item with type ===
 * itemType.FERTILIZER.
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const fertilizePlot = (state, x, y) => {
  const { field, selectedItemId } = state
  const row = field[y]
  const plotContent = row[x]

  if (!plotContent || itemsMap[selectedItemId]?.type !== itemType.FERTILIZER) {
    return state
  }

  const { id: fertilizerItemId } = itemsMap[selectedItemId]

  const fertilizerInventory = state.inventory.find(
    item => item.id === fertilizerItemId
  )

  const plotContentType = getPlotContentType(plotContent)

  if (
    !plotContent ||
    !fertilizerInventory ||
    plotContent.fertilizerType !== fertilizerType.NONE ||
    (selectedItemId === 'fertilizer' && plotContentType !== itemType.CROP) ||
    (selectedItemId === 'rainbow-fertilizer' &&
      plotContentType !== itemType.CROP &&
      plotContentType !== itemType.SCARECROW)
  ) {
    return state
  }

  const { quantity: initialFertilizerQuantity } = fertilizerInventory
  state = decrementItemFromInventory(state, fertilizerItemId)
  const doFertilizersRemain = initialFertilizerQuantity > 1

  state = modifyFieldPlotAt(state, x, y, crop => ({
    ...crop,
    fertilizerType: fertilizerItemIdToTypeMap[fertilizerItemId],
  }))

  return {
    ...state,
    fieldMode: doFertilizersRemain ? FERTILIZE : OBSERVE,
    selectedItemId: doFertilizersRemain ? fertilizerItemId : '',
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const setSprinkler = (state, x, y) => {
  const { field } = state
  const plot = field[y][x]

  // Only set sprinklers in empty plots
  if (plot !== null) {
    return state
  }

  state = decrementItemFromInventory(state, SPRINKLER_ITEM_ID)

  const doSprinklersRemain = state.inventory.some(
    item => item.id === SPRINKLER_ITEM_ID
  )

  state = modifyFieldPlotAt(state, x, y, () =>
    getPlotContentFromItemId(SPRINKLER_ITEM_ID)
  )

  state = processSprinklers(state)

  return {
    ...state,
    fieldMode: doSprinklersRemain ? SET_SPRINKLER : OBSERVE,
    selectedItemId: doSprinklersRemain ? SPRINKLER_ITEM_ID : '',
  }
}

const fieldReducer = (acc, fn) => fn(acc)
const fieldUpdaters = [
  incrementPlotContentAge,
  resetWasWatered,
  resetWasShoveled,
]

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processField = state => ({
  ...state,
  field: updateField(state.field, plotContent =>
    fieldUpdaters.reduce(fieldReducer, plotContent)
  ),
})

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const setScarecrow = (state, x, y) => {
  const plot = state.field[y][x]

  // Only set scarecrows in empty plots
  if (plot !== null) {
    return state
  }

  state = decrementItemFromInventory(state, SCARECROW_ITEM_ID)

  const doScarecrowsRemain = state.inventory.some(
    item => item.id === SCARECROW_ITEM_ID
  )

  state = modifyFieldPlotAt(state, x, y, () =>
    getPlotContentFromItemId(SCARECROW_ITEM_ID)
  )

  return {
    ...state,
    fieldMode: doScarecrowsRemain ? SET_SCARECROW : OBSERVE,
    selectedItemId: doScarecrowsRemain ? SCARECROW_ITEM_ID : '',
  }
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

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const minePlot = (state, x, y) => {
  const { field } = state
  const row = field[y]

  if (row[x]) {
    // Something is already planted in field[x][y]
    return state
  }

  if (!doesInventorySpaceRemain(state)) {
    return showNotification(state, INVENTORY_FULL_NOTIFICATION)
  }

  const shovelLevel = state.toolLevels[toolType.SHOVEL]
  const spawnedResources = ResourceFactory.instance().generateResources(
    shovelLevel
  )
  let spawnedOre = null
  let daysUntilClear = chooseRandom([1, 2, 2, 3])

  if (spawnedResources.length) {
    // even when multiple resources are spawned, the first one is ok to use
    // for all subsequent logic
    spawnedOre = spawnedResources[0]

    // if ore was spawned, add up to 10 days to the time to clear
    // at random, based loosely on the spawnChance meant to make
    // rarer ores take longer to cooldown
    daysUntilClear += Math.round(
      Math.random() * (1 - spawnedOre.spawnChance) * 10
    )

    for (let resource of spawnedResources) {
      state = addItemToInventory(state, resource)
    }
  }

  state = modifyFieldPlotAt(state, x, y, () => {
    return {
      isShoveled: true,
      daysUntilClear,
      oreId: spawnedOre ? spawnedOre.id : null,
    }
  })

  return {
    ...state,
  }
}

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
