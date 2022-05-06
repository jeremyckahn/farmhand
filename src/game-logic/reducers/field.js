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
  farmProductsSold,
  findInField,
  getCropFromItemId,
  getCropLifeStage,
  getFinalCropItemIdFromSeedItemId,
  getInventoryQuantityMap,
  getLevelEntitlements,
  getPlotContentFromItemId,
  getPlotContentType,
  getRangeCoords,
  getSeedItemIdFromFinalStageCropItemId,
  isRandomNumberLessThan,
  levelAchieved,
} from '../../utils'
import {
  CROW_CHANCE,
  HOE_LEVEL_TO_SEED_RECLAIM_RATE,
  PRECIPITATION_CHANCE,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
  STORM_CHANCE,
} from '../../constants'
import {
  INVENTORY_FULL_NOTIFICATION,
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from '../../strings'
import { CROW_ATTACKED } from '../../templates'
import { ResourceFactory } from '../../factories'

import { applyChanceEvent } from './helpers'
import { showNotification } from './common'
import { addItemToInventory } from './addItemToInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'
import { incrementPlotContentAge } from './incrementPlotContentAge'

const { FERTILIZE, OBSERVE, SET_SCARECROW, SET_SPRINKLER } = fieldMode
const { GROWN } = cropLifeStage

/**
 * @param {?farmhand.plotContent} plot
 * @returns {boolean}
 */
const plotContainsScarecrow = plot => plot && plot.itemId === SCARECROW_ITEM_ID

/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @returns {boolean}
 */
const fieldHasScarecrow = field => findInField(field, plotContainsScarecrow)

/**
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
const updateField = (field, modifierFn) =>
  field.map((row, y) => row.map((plot, x) => modifierFn(plot, x, y)))

/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export const resetWasShoveled = plotContent => {
  if (plotContent && plotContent.isShoveled && plotContent.daysUntilClear > 1) {
    return {
      ...plotContent,
      daysUntilClear: plotContent.daysUntilClear - 1,
    }
  }

  return plotContent && !plotContent.isShoveled ? plotContent : null
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyPrecipitation = state => {
  let { field } = state
  let scarecrowsConsumedByReplanting = 0
  let notification

  if (Math.random() < STORM_CHANCE) {
    if (fieldHasScarecrow(field)) {
      notification = {
        message: STORM_DESTROYS_SCARECROWS_MESSAGE,
        severity: 'error',
      }

      let { scarecrow: scarecrowsInInventory = 0 } = getInventoryQuantityMap(
        state.inventory
      )

      field = updateField(field, plot => {
        if (!plotContainsScarecrow(plot)) {
          return plot
        }

        if (
          scarecrowsInInventory &&
          plot.fertilizerType === fertilizerType.RAINBOW
        ) {
          scarecrowsInInventory--
          scarecrowsConsumedByReplanting++

          return plot
        }

        return null
      })
    } else {
      notification = { message: STORM_MESSAGE, severity: 'info' }
    }
  } else {
    notification = { message: RAIN_MESSAGE, severity: 'info' }
  }

  state = decrementItemFromInventory(
    { ...state, field },
    'scarecrow',
    scarecrowsConsumedByReplanting
  )

  state = {
    ...state,
    newDayNotifications: [...state.newDayNotifications, notification],
  }

  state = waterField(state)

  return state
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyCrows = state => {
  const { field } = state
  const newDayNotifications = [...state.newDayNotifications]

  let notificationMessages = []

  const updatedField = fieldHasScarecrow(field)
    ? field
    : updateField(field, plotContent => {
        if (!plotContent || getPlotContentType(plotContent) !== itemType.CROP) {
          return plotContent
        }

        const destroyCrop = Math.random() <= CROW_CHANCE

        if (destroyCrop) {
          notificationMessages.push(
            CROW_ATTACKED`${itemsMap[plotContent.itemId]}`
          )
        }

        return destroyCrop ? null : plotContent
      })

  if (notificationMessages.length) {
    newDayNotifications.push({
      message: notificationMessages.join('\n\n'),
      severity: 'error',
    })
  }

  return { ...state, field: updatedField, newDayNotifications }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterField = state => ({
  ...state,
  field: updateField(state.field, setWasWatered),
})

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterAllPlots = state => waterField(state)

/**
 * @param {?farmhand.plotContent} plotContent
 * @param {boolean} wasWateredToday
 * @returns {?farmhand.plotContent}
 */
const setWasWateredProperty = (plotContent, wasWateredToday) => {
  if (plotContent === null) {
    return null
  }

  return getPlotContentType(plotContent) === itemType.CROP
    ? { ...plotContent, wasWateredToday }
    : { ...plotContent }
}

/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export const setWasWatered = plotContent =>
  setWasWateredProperty(plotContent, true)

/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
export const resetWasWatered = plotContent =>
  setWasWateredProperty(plotContent, false)

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processWeather = state =>
  applyChanceEvent([[PRECIPITATION_CHANCE, applyPrecipitation]], state)

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processSprinklers = state => {
  const { field, itemsSold } = state
  const crops = new Map()
  let modifiedField = [...field]

  const { sprinklerRange } = getLevelEntitlements(
    levelAchieved(farmProductsSold(itemsSold))
  )

  field.forEach((row, plotY) => {
    row.forEach((plot, plotX) => {
      if (!plot || getPlotContentType(plot) !== itemType.SPRINKLER) {
        return
      }

      ;[]
        .concat(
          // Flatten this 2D array for less iteration below
          ...getRangeCoords(sprinklerRange, plotX, plotY)
        )
        .forEach(({ x, y }) => {
          const fieldRow = field[y]

          if (!fieldRow) {
            return
          }

          const plotContent = fieldRow[x]

          if (
            plotContent &&
            getPlotContentType(plotContent) === itemType.CROP
          ) {
            if (!crops.has(plotContent)) {
              modifiedField = modifyFieldPlotAt(
                { ...state, field: modifiedField },
                x,
                y,
                setWasWatered
              ).field
            }

            crops.set(plotContent, { x, y })
          }
        })
    })
  })

  return { ...state, field: modifiedField }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {farmhand.state}
 */
export const modifyFieldPlotAt = (state, x, y, modifierFn) => {
  const { field } = state
  const row = [...field[y]]
  const plotContent = modifierFn(row[x])
  row[x] = plotContent
  const modifiedField = [...field]
  modifiedField[y] = row

  return { ...state, field: modifiedField }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const removeFieldPlotAt = (state, x, y) =>
  modifyFieldPlotAt(state, x, y, () => null)

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @param {string} plantableItemId
 * @returns {farmhand.state}
 */
export const plantInPlot = (state, x, y, plantableItemId) => {
  if (
    !plantableItemId ||
    !state.inventory.some(({ id }) => id === plantableItemId)
  ) {
    return state
  }

  const { field } = state
  const row = field[y]
  const finalCropItemId = getFinalCropItemIdFromSeedItemId(plantableItemId)

  if (row[x]) {
    // Something is already planted in field[x][y]
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
