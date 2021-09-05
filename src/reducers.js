/**
 * @module farmhand.reducers
 * @ignore
 */

import { itemsMap, recipesMap } from './data/maps'
import { levels } from './data/levels'
import { ResourceFactory } from './factories'
import achievements from './data/achievements'
import {
  areHuggingMachinesInInventory,
  canMakeRecipe,
  castToMoney,
  chooseRandom,
  clampNumber,
  doesInventorySpaceRemain,
  farmProductsSold,
  filterItemIdsToSeeds,
  findCowById,
  findInField,
  generateCow,
  generateOffspringCow,
  get7DayAverage,
  getAdjustedItemValue,
  getCostOfNextStorageExpansion,
  getCowColorId,
  getCowFertilizerItem,
  getCowFertilizerProductionRate,
  getCowMilkItem,
  getCowMilkRate,
  getCowValue,
  getCropFromItemId,
  getCropLifeStage,
  getFinalCropItemIdFromSeedItemId,
  getInventoryQuantityMap,
  getLevelEntitlements,
  getPlotContentFromItemId,
  getPlotContentType,
  getPriceEventForCrop,
  getProfit,
  getRandomLevelUpReward,
  getRandomLevelUpRewardQuantity,
  getRandomUnlockedCrop,
  getRangeCoords,
  getResaleValue,
  getSalePriceMultiplier,
  getSeedItemIdFromFinalStageCropItemId,
  inventorySpaceRemaining,
  isItemAFarmProduct,
  isItemSoldInShop,
  levelAchieved,
  moneyTotal,
  nullArray,
} from './utils'
import { generateValueAdjustments } from './common/utils'
import {
  COW_FEED_ITEM_ID,
  COW_GESTATION_PERIOD_DAYS,
  COW_HUG_BENEFIT,
  COW_MINIMUM_HAPPINESS_TO_BREED,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  CROW_CHANCE,
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH,
  FERTILIZER_BONUS,
  HUGGING_MACHINE_ITEM_ID,
  LOAN_GARNISHMENT_RATE,
  LOAN_INTEREST_RATE,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_DAILY_COW_HUG_BENEFITS,
  MAX_LATEST_PEER_MESSAGES,
  MAX_PENDING_PEER_MESSAGES,
  NOTIFICATION_LOG_SIZE,
  PRECIPITATION_CHANCE,
  PRICE_EVENT_CHANCE,
  PURCHASEABLE_COMBINES,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  PURCHASEABLE_SMELTERS,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
  STORAGE_EXPANSION_AMOUNT,
  STORM_CHANCE,
} from './constants'
import {
  OUT_OF_COW_FEED_NOTIFICATION,
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from './strings'
import {
  ACHIEVEMENT_COMPLETED,
  COW_ATTRITION_MESSAGE,
  COW_BORN_MESSAGE,
  CROW_ATTACKED,
  FERTILIZERS_PRODUCED,
  LEVEL_GAINED_NOTIFICATION,
  LOAN_BALANCE_NOTIFICATION,
  LOAN_INCREASED,
  LOAN_PAYOFF,
  MILKS_PRODUCED,
  PRICE_CRASH,
  PRICE_SURGE,
  PURCHASED_ITEM_PEER_NOTIFICATION,
  SOLD_ITEM_PEER_NOTIFICATION,
} from './templates'
import { cropLifeStage, fertilizerType, fieldMode, itemType } from './enums'

const { FERTILIZE, OBSERVE, SET_SCARECROW, SET_SPRINKLER } = fieldMode
const { GROWN } = cropLifeStage

///////////////////////////////////////////////////////////
//
// Local helper functions
//
///////////////////////////////////////////////////////////

/**
 * @param {?farmhand.crop} crop
 * @returns {?farmhand.crop}
 */
export const incrementPlotContentAge = crop =>
  crop && getPlotContentType(crop) === itemType.CROP
    ? {
        ...crop,
        daysOld: crop.daysOld + 1,
        daysWatered:
          crop.daysWatered +
          (crop.wasWateredToday
            ? 1 +
              (crop.fertilizerType === fertilizerType.NONE
                ? 0
                : FERTILIZER_BONUS)
            : 0),
      }
    : crop

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
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
const updateField = (field, modifierFn) =>
  field.map((row, y) => row.map((plot, x) => modifierFn(plot, x, y)))

/**
 * @param {Array} chancesAndEvents An array of arrays in which the first
 * element is a number and the second number is a function.
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
const applyChanceEvent = (chancesAndEvents, state) =>
  chancesAndEvents.reduce(
    (acc, [chance, fn]) => (Math.random() <= chance ? fn(acc) : acc),
    state
  )

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
export const processNerfs = state => applyChanceEvent([[1, applyCrows]], state)

/**
 * @param {farmhand.state} state
 * @param {farmhand.priceEvent} priceEvent
 * @param {string} priceEventKey Either 'priceCrashes' or 'priceSurges'
 * @returns {farmhand.state}
 */
export const createPriceEvent = (state, priceEvent, priceEventKey) => ({
  [priceEventKey]: {
    ...state[priceEventKey],
    [priceEvent.itemId]: priceEvent,
  },
})

/**
 * @param {farmhand.state} state
 * @param {number} oldLevel
 * @returns {farmhand.state}
 */
export const processLevelUp = (state, oldLevel) => {
  const { itemsSold, selectedItemId } = state
  const newLevel = levelAchieved(farmProductsSold(itemsSold))

  // Loop backwards so that the notifications appear in descending order.
  for (let i = newLevel; i > oldLevel; i--) {
    const levelObject = levels[i] || {}

    let randomCropSeed
    // There is no predefined reward for this level up.
    if (Object.keys(levelObject).length < 2) {
      randomCropSeed = getRandomLevelUpReward(i)
      state = addItemToInventory(
        state,
        randomCropSeed,
        getRandomLevelUpRewardQuantity(i),
        true
      )
    }
    // This handles an edge case where the player levels up to level that
    // unlocks greater sprinkler range, but the sprinkler item is already
    // selected. In that case, update the hoveredPlotRangeSize state.
    else if (
      levelObject &&
      levelObject.increasesSprinklerRange &&
      selectedItemId === SPRINKLER_ITEM_ID
    ) {
      const { sprinklerRange } = getLevelEntitlements(
        levelAchieved(farmProductsSold(itemsSold))
      )

      if (sprinklerRange > state.hoveredPlotRangeSize) {
        state = {
          ...state,
          hoveredPlotRangeSize: sprinklerRange,
        }
      }
    }

    state = showNotification(
      state,
      LEVEL_GAINED_NOTIFICATION`${i}${randomCropSeed}`,
      'success'
    )
  }

  return state
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
const adjustItemValues = state => ({
  ...state,
  historicalValueAdjustments: [state.valueAdjustments],
  valueAdjustments: generateValueAdjustments(
    state.priceCrashes,
    state.priceSurges
  ),
})

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

///////////////////////////////////////////////////////////
//
// Exported reducers
//
///////////////////////////////////////////////////////////

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
 * @returns {farmhand.state}
 */
export const processFeedingCows = state => {
  const cowInventory = [...state.cowInventory]
  const { length: cowInventoryLength } = cowInventory
  const newDayNotifications = [...state.newDayNotifications]
  let inventory = [...state.inventory]

  const cowFeedInventoryPosition = inventory.findIndex(
    ({ id }) => id === COW_FEED_ITEM_ID
  )

  const cowFeed = inventory[cowFeedInventoryPosition]
  const quantity = cowFeed ? cowFeed.quantity : 0

  let unitsSpent = 0

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]
    const anyUnitsRemain = unitsSpent < quantity

    cowInventory[i] = {
      ...cow,
      weightMultiplier: clampNumber(
        anyUnitsRemain
          ? cow.weightMultiplier + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
          : cow.weightMultiplier - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM
      ),
    }

    if (anyUnitsRemain) {
      unitsSpent++
    }
  }

  if (quantity <= cowInventoryLength && cowInventoryLength > 0) {
    newDayNotifications.push({
      message: OUT_OF_COW_FEED_NOTIFICATION,
      severity: 'error',
    })
  }

  return decrementItemFromInventory(
    { ...state, cowInventory, inventory, newDayNotifications },
    COW_FEED_ITEM_ID,
    unitsSpent
  )
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowAttrition = state => {
  const newDayNotifications = [...state.newDayNotifications]
  const oldCowInventory = [...state.cowInventory]

  for (let i = 0; i < oldCowInventory.length; i++) {
    const cow = oldCowInventory[i]

    if (
      // Cast toFixed(2) to prevent IEEE 754 rounding errors.
      Number(cow.weightMultiplier.toFixed(2)) === COW_WEIGHT_MULTIPLIER_MINIMUM
    ) {
      state = removeCowFromInventory(state, cow)

      newDayNotifications.push({
        message: COW_ATTRITION_MESSAGE`${cow}`,
        severity: 'error',
      })
    }
  }

  return { ...state, newDayNotifications }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processMilkingCows = state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory
  const milksProduced = {}

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (cow.daysSinceMilking > getCowMilkRate(cow)) {
      cowInventory[i] = { ...cow, daysSinceMilking: 0 }

      const milk = getCowMilkItem(cow)
      const { name } = milk

      if (!doesInventorySpaceRemain(state)) {
        break
      }

      milksProduced[name] = (milksProduced[name] || 0) + 1
      state = addItemToInventory(state, milk)
    }
  }

  if (Object.keys(milksProduced).length) {
    newDayNotifications.push({
      message: MILKS_PRODUCED`${milksProduced}`,
      severity: 'success',
    })
  }

  return { ...state, cowInventory, newDayNotifications }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowFertilizerProduction = state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory
  const fertilizersProduced = {}

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (
      // `cow.daysSinceProducingFertilizer || 0` is needed because legacy cows
      // did not define daysSinceProducingFertilizer.
      (cow.daysSinceProducingFertilizer || 0) >
      getCowFertilizerProductionRate(cow)
    ) {
      cowInventory[i] = { ...cow, daysSinceProducingFertilizer: 0 }

      const fertilizer = getCowFertilizerItem(cow)
      const { name } = fertilizer

      if (!doesInventorySpaceRemain(state)) {
        break
      }

      fertilizersProduced[name] = (fertilizersProduced[name] || 0) + 1
      state = addItemToInventory(state, fertilizer)
    }
  }

  if (Object.keys(fertilizersProduced).length) {
    newDayNotifications.push({
      message: FERTILIZERS_PRODUCED`${fertilizersProduced}`,
      severity: 'success',
    })
  }

  return { ...state, cowInventory, newDayNotifications }
}

/**
 * Only adds as many items as there is room in the inventory for unless
 * allowInventoryOverage is true.
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @param {boolean} [allowInventoryOverage=false]
 * @returns {farmhand.state}
 */
export const addItemToInventory = (
  state,
  item,
  howMany = 1,
  allowInventoryOverage = false
) => {
  const { id } = item
  const inventory = [...state.inventory]

  const numberOfItemsToAdd = allowInventoryOverage
    ? howMany
    : Math.min(howMany, inventorySpaceRemaining(state))

  if (numberOfItemsToAdd === 0) {
    return state
  }

  const currentItemSlot = inventory.findIndex(({ id: itemId }) => id === itemId)

  if (~currentItemSlot) {
    const currentItem = inventory[currentItemSlot]

    inventory[currentItemSlot] = {
      ...currentItem,
      quantity: currentItem.quantity + numberOfItemsToAdd,
    }
  } else {
    inventory.push({ id, quantity: numberOfItemsToAdd })
  }

  return { ...state, inventory }
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
const processField = state => ({
  ...state,
  field: updateField(state.field, plotContent =>
    fieldUpdaters.reduce(fieldReducer, plotContent)
  ),
})

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowBreeding = state => {
  const {
    cowBreedingPen,
    cowInventory,
    newDayNotifications,
    purchasedCowPen,
  } = state
  const { cowId1, cowId2 } = cowBreedingPen

  if (!cowId2) {
    return state
  }

  const cow1 = findCowById(cowInventory, cowId1)
  const cow2 = findCowById(cowInventory, cowId2)

  // Same-sex couples are as valid and wonderful as any, but in this game they
  // cannot naturally produce offspring.
  if (cow1.gender === cow2.gender) {
    return state
  }

  const daysUntilBirth =
    cow1.happiness >= COW_MINIMUM_HAPPINESS_TO_BREED &&
    cow2.happiness >= COW_MINIMUM_HAPPINESS_TO_BREED
      ? cowBreedingPen.daysUntilBirth - 1
      : COW_GESTATION_PERIOD_DAYS

  const shouldGenerateOffspring =
    cowInventory.length < PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows &&
    daysUntilBirth === 0

  let offspringCow = shouldGenerateOffspring && generateOffspringCow(cow1, cow2)

  return {
    ...state,
    cowInventory: shouldGenerateOffspring
      ? [...cowInventory, offspringCow]
      : cowInventory,
    cowBreedingPen: {
      ...cowBreedingPen,
      daysUntilBirth: shouldGenerateOffspring
        ? COW_GESTATION_PERIOD_DAYS
        : daysUntilBirth,
    },
    newDayNotifications: offspringCow
      ? [
          ...newDayNotifications,
          {
            message: COW_BORN_MESSAGE`${cow1}${cow2}${offspringCow}`,
            severity: 'success',
          },
        ]
      : newDayNotifications,
  }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeCowInventoryForNextDay = state => ({
  ...state,
  cowInventory: state.cowInventory.map(cow => ({
    ...cow,
    daysOld: cow.daysOld + 1,
    daysSinceMilking: cow.daysSinceMilking + 1,
    // `cow.daysSinceProducingFertilizer || 0` is needed because legacy cows
    // did not define daysSinceProducingFertilizer.
    daysSinceProducingFertilizer: (cow.daysSinceProducingFertilizer || 0) + 1,
    happiness: Math.max(
      0,
      cow.isUsingHuggingMachine
        ? Math.min(
            1,
            cow.happiness + (MAX_DAILY_COW_HUG_BENEFITS - 1) * COW_HUG_BENEFIT
          )
        : cow.happiness - COW_HUG_BENEFIT
    ),
    happinessBoostsToday: cow.isUsingHuggingMachine
      ? MAX_DAILY_COW_HUG_BENEFITS
      : 0,

    // TODO: This line is for backwards compatibility and can be removed after
    // 10/1/2020.
    isUsingHuggingMachine: Boolean(cow.isUsingHuggingMachine),
  })),
})

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
 * @param {string} itemId
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const decrementItemFromInventory = (state, itemId, howMany = 1) => {
  const inventory = [...state.inventory]
  const itemInventoryIndex = inventory.findIndex(({ id }) => id === itemId)

  if (itemInventoryIndex === -1) {
    return state
  }

  const { quantity } = inventory[itemInventoryIndex]

  if (quantity > howMany) {
    inventory[itemInventoryIndex] = {
      ...inventory[itemInventoryIndex],
      quantity: quantity - howMany,
    }
  } else {
    inventory.splice(itemInventoryIndex, 1)
  }

  return { ...state, inventory }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const rotateNotificationLogs = state => {
  const notificationLog = [...state.notificationLog]

  const { dayCount, newDayNotifications } = state

  const notifications = {
    error: [],
    info: [],
    success: [],
    warning: [],
  }

  newDayNotifications.forEach(({ message, severity }) =>
    notifications[severity].push(message)
  )

  newDayNotifications.length &&
    notificationLog.unshift({
      day: dayCount,
      notifications,
    })

  notificationLog.length = Math.min(
    notificationLog.length,
    NOTIFICATION_LOG_SIZE
  )

  return { ...state, notificationLog }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const generatePriceEvents = state => {
  const priceCrashes = { ...state.priceCrashes }
  const priceSurges = { ...state.priceSurges }
  let newDayNotifications = [...state.newDayNotifications]
  let priceEvent

  if (Math.random() < PRICE_EVENT_CHANCE) {
    const { items: unlockedItems } = getLevelEntitlements(
      levelAchieved(farmProductsSold(state.itemsSold))
    )

    const cropItem = getRandomUnlockedCrop(
      filterItemIdsToSeeds(Object.keys(unlockedItems))
    )
    const { id } = cropItem

    // Only create a priceEvent if one does not already exist
    if (!priceCrashes[id] && !priceSurges[id]) {
      const priceEventType =
        Math.random() < 0.5 ? 'priceCrashes' : 'priceSurges'

      priceEvent = createPriceEvent(
        state,
        getPriceEventForCrop(cropItem),
        priceEventType
      )

      newDayNotifications.push(
        priceEventType === 'priceCrashes'
          ? {
              message: PRICE_CRASH`${cropItem}`,
              severity: 'warning',
            }
          : {
              message: PRICE_SURGE`${cropItem}`,
              severity: 'success',
            }
      )
    }
  }

  return { ...state, ...priceEvent, newDayNotifications }
}

/**
 * @param {Object.<farmhand.priceEvent>} priceEvents
 * @returns {Object.<farmhand.priceEvent>}
 */
const decrementPriceEventDays = priceEvents =>
  Object.keys(priceEvents).reduce((acc, key) => {
    const { itemId, daysRemaining } = priceEvents[key]

    if (daysRemaining > 1) {
      acc[key] = { itemId, daysRemaining: daysRemaining - 1 }
    }

    return acc
  }, {})

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updatePriceEvents = state => {
  const { priceCrashes, priceSurges } = state

  return {
    ...state,
    priceCrashes: decrementPriceEventDays(priceCrashes),
    priceSurges: decrementPriceEventDays(priceSurges),
  }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updateFinancialRecords = state => {
  const {
    profitabilityStreak,
    todaysLosses,
    todaysRevenue,
    record7dayProfitAverage,
    recordProfitabilityStreak,
  } = state
  let {
    historicalDailyLosses,
    historicalDailyRevenue,
    recordSingleDayProfit,
  } = state

  historicalDailyLosses = [todaysLosses, ...historicalDailyLosses].slice(
    0,
    DAILY_FINANCIAL_HISTORY_RECORD_LENGTH
  )

  historicalDailyRevenue = [todaysRevenue, ...historicalDailyRevenue].slice(
    0,
    DAILY_FINANCIAL_HISTORY_RECORD_LENGTH
  )

  const profitAverage = get7DayAverage(
    historicalDailyLosses.map((loss, i) =>
      moneyTotal(historicalDailyRevenue[i], loss)
    )
  )

  const wasTodayProfitable = todaysRevenue + todaysLosses > 0
  const currentProfitabilityStreak = wasTodayProfitable
    ? profitabilityStreak + 1
    : 0

  return {
    ...state,
    historicalDailyLosses,
    historicalDailyRevenue,
    profitabilityStreak: currentProfitabilityStreak,
    record7dayProfitAverage: Math.max(record7dayProfitAverage, profitAverage),
    recordProfitabilityStreak: Math.max(
      recordProfitabilityStreak,
      currentProfitabilityStreak
    ),
    recordSingleDayProfit: Math.max(
      recordSingleDayProfit,
      getProfit(todaysRevenue, todaysLosses)
    ),
    todaysLosses: 0,
    todaysRevenue: 0,
  }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updateInventoryRecordsForNextDay = state => ({
  ...state,
  todaysPurchases: {},
  todaysStartingInventory: state.inventory.reduce((acc, { id, quantity }) => {
    acc[id] = quantity
    return acc
  }, {}),
})

export const applyLoanInterest = state => {
  const loanBalance = moneyTotal(
    state.loanBalance,
    castToMoney(state.loanBalance * LOAN_INTEREST_RATE)
  )

  const newDayNotifications =
    loanBalance > 0
      ? [
          ...state.newDayNotifications,
          {
            severity: 'warning',
            message: LOAN_BALANCE_NOTIFICATION`${loanBalance}`,
          },
        ]
      : state.newDayNotifications

  return {
    ...state,
    loanBalance,
    newDayNotifications,
  }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeStateForNextDay = (state, isFirstDay = false) =>
  (isFirstDay
    ? []
    : [
        computeCowInventoryForNextDay,
        processCowBreeding,
        processField,
        processNerfs,
        processWeather,
        processSprinklers,
        processFeedingCows,
        processCowAttrition,
        processMilkingCows,
        processCowFertilizerProduction,
        updatePriceEvents,
        updateFinancialRecords,
        updateInventoryRecordsForNextDay,
        generatePriceEvents,
        applyLoanInterest,
        rotateNotificationLogs,
      ]
  )
    .concat([adjustItemValues])
    .reduce((acc, fn) => fn({ ...acc }), {
      ...state,
      cowForSale: generateCow(),
      dayCount: state.dayCount + 1,
      todaysNotifications: [],
    })

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const purchaseItem = (state, item, howMany = 1) => {
  const { money, todaysPurchases, valueAdjustments } = state
  const numberOfItemsToAdd = Math.min(howMany, inventorySpaceRemaining(state))

  if (numberOfItemsToAdd === 0) {
    return state
  }

  const value = getAdjustedItemValue(valueAdjustments, item.id)
  const totalValue = value * numberOfItemsToAdd

  if (totalValue > money) {
    return state
  }

  state = prependPendingPeerMessage(
    state,
    PURCHASED_ITEM_PEER_NOTIFICATION`${howMany}${item}`
  )

  return addItemToInventory(
    {
      ...state,
      money: moneyTotal(money, -totalValue),
      todaysPurchases: {
        ...todaysPurchases,
        [item.id]: (todaysPurchases[item.id] || 0) + numberOfItemsToAdd,
      },
    },
    item,
    numberOfItemsToAdd
  )
}

/**
 * @param {farmhand.state} state
 * @param {number} revenue
 * @returns {farmhand.state}
 */
const addRevenue = (state, revenueToAdd) => {
  const { money, revenue, todaysRevenue } = state

  return {
    ...state,
    money: moneyTotal(money, revenueToAdd),
    revenue: moneyTotal(revenue, revenueToAdd),
    todaysRevenue: moneyTotal(todaysRevenue, revenueToAdd),
  }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const sellItem = (state, { id }, howMany = 1) => {
  if (howMany === 0) {
    return state
  }

  const item = itemsMap[id]
  const {
    completedAchievements,
    itemsSold,
    money: initialMoney,
    valueAdjustments,
  } = state
  const oldLevel = levelAchieved(farmProductsSold(itemsSold))
  let { loanBalance } = state

  const adjustedItemValue = isItemSoldInShop(item)
    ? getResaleValue(item)
    : getAdjustedItemValue(valueAdjustments, id)
  const saleIsGarnished = isItemAFarmProduct(item)
  let saleValue = 0
  for (let i = 0; i < howMany; i++) {
    const loanGarnishment = saleIsGarnished
      ? Math.min(
          loanBalance,
          castToMoney(adjustedItemValue * LOAN_GARNISHMENT_RATE)
        )
      : 0
    const garnishedProfit =
      adjustedItemValue * getSalePriceMultiplier(completedAchievements) -
      loanGarnishment
    loanBalance = moneyTotal(loanBalance, -loanGarnishment)
    saleValue = moneyTotal(saleValue, garnishedProfit)
  }

  if (saleIsGarnished) {
    state = adjustLoan(state, moneyTotal(loanBalance, -state.loanBalance))
  }

  const newItemsSold = { ...itemsSold, [id]: (itemsSold[id] || 0) + howMany }

  // money needs to be passed in explicitly here because state.money gets
  // mutated above and addRevenue needs its initial value.
  state = addRevenue({ ...state, money: initialMoney }, saleValue)

  state = {
    ...state,
    itemsSold: newItemsSold,
  }

  state = processLevelUp(state, oldLevel)
  state = decrementItemFromInventory(state, id, howMany)

  state = prependPendingPeerMessage(
    state,
    SOLD_ITEM_PEER_NOTIFICATION`${howMany}${item}`,
    'warning'
  )

  return updateLearnedRecipes(state)
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updateLearnedRecipes = state => ({
  ...state,
  learnedRecipes: Object.keys(recipesMap).reduce((acc, recipeId) => {
    if (recipesMap[recipeId].condition(state)) {
      acc[recipeId] = true
    }

    return acc
  }, {}),
})

/**
 * @param {farmhand.state} state
 * @param {farmhand.recipe} recipe
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const makeRecipe = (state, recipe, howMany = 1) => {
  if (!canMakeRecipe(recipe, state.inventory, howMany)) {
    return state
  }

  state = Object.keys(recipe.ingredients).reduce(
    (state, ingredientId) =>
      decrementItemFromInventory(
        state,
        ingredientId,
        recipe.ingredients[ingredientId] * howMany
      ),
    state
  )

  return addItemToInventory(state, recipe, howMany)
}

// TODO: Change showNotification to accept a configuration object instead of so
// many formal parameters.
/**
 * @param {farmhand.state} state
 * @param {string} message
 * @param {string} [severity] Corresponds to the `severity` prop here:
 * https://material-ui.com/api/alert/
 * @returns {farmhand.state}
 * @see https://material-ui.com/api/alert/
 */
export const showNotification = (
  state,
  message,
  severity = 'info',
  onClick = undefined
) => {
  const { showNotifications, todaysNotifications } = state

  return {
    ...state,
    ...(showNotifications && {
      latestNotification: {
        message,
        onClick,
        severity,
      },
    }),
    // Don't show redundant notifications
    todaysNotifications: todaysNotifications.find(
      notification => notification.message === message
    )
      ? todaysNotifications
      : todaysNotifications.concat({ message, onClick, severity }),
  }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const purchaseCow = (state, cow) => {
  const { cowInventory, cowColorsPurchased, money, purchasedCowPen } = state
  const { color } = cow
  const cowValue = getCowValue(cow, false)

  if (
    money < cowValue ||
    purchasedCowPen === 0 ||
    cowInventory.length >= PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows
  ) {
    return state
  }

  return {
    ...state,
    cowInventory: [...cowInventory, { ...cow }],
    cowColorsPurchased: {
      ...cowColorsPurchased,
      [color]: (cowColorsPurchased[color] || 0) + 1,
    },
    money: moneyTotal(money, -cowValue),
    cowForSale: generateCow(),
  }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const sellCow = (state, cow) => {
  const { cowsSold, money } = state
  const cowValue = getCowValue(cow, true)

  state = removeCowFromInventory(state, cow)

  const cowColorId = getCowColorId(cow)

  if (cow.isBred) {
    state = addRevenue(state, cowValue)
  } else {
    state = {
      ...state,
      money: moneyTotal(money, cowValue),
    }
  }

  const newCowsSold = {
    ...cowsSold,
    [cowColorId]: (cowsSold[cowColorId] || 0) + 1,
  }

  state = { ...state, cowsSold: newCowsSold }

  return state
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const removeCowFromInventory = (state, cow) => {
  const cowInventory = [...state.cowInventory]
  const { isUsingHuggingMachine } = cow

  cowInventory.splice(cowInventory.indexOf(cow), 1)

  if (isUsingHuggingMachine) {
    state = addItemToInventory(state, itemsMap[HUGGING_MACHINE_ITEM_ID])
  }

  state = changeCowBreedingPenResident(state, cow, false)

  return { ...state, cowInventory }
}

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @param {Function(farmhand.cow)} fn Must return the modified cow or
 * undefined.
 * @returns {farmhand.state}
 */
export const modifyCow = (state, cowId, fn) => {
  const cowInventory = [...state.cowInventory]
  const cow = cowInventory.find(({ id }) => id === cowId)
  const cowIndex = cowInventory.indexOf(cow)

  cowInventory[cowIndex] = {
    ...cow,
    ...fn(cow),
  }

  return {
    ...state,
    cowInventory,
  }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} doAutomaticallyHug
 * @returns {farmhand.state}
 */
export const changeCowAutomaticHugState = (state, cow, doAutomaticallyHug) => {
  if (
    (doAutomaticallyHug && !areHuggingMachinesInInventory(state.inventory)) ||
    // TODO: This Boolean cast is needed for backwards compatibility. Remove it
    // after 10/1/2020.
    Boolean(cow.isUsingHuggingMachine) === doAutomaticallyHug
  ) {
    return state
  }

  state = modifyCow(state, cow.id, cow => ({
    ...cow,
    isUsingHuggingMachine: doAutomaticallyHug,
  }))

  state = doAutomaticallyHug
    ? decrementItemFromInventory(state, HUGGING_MACHINE_ITEM_ID)
    : addItemToInventory(state, itemsMap[HUGGING_MACHINE_ITEM_ID])

  return state
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} doAdd If true, cow will be added to the breeding pen. If
 * false, they will be removed.
 * @returns {farmhand.state}
 */
export const changeCowBreedingPenResident = (state, cow, doAdd) => {
  const { cowBreedingPen } = state
  const { cowId1, cowId2 } = cowBreedingPen
  const isPenFull = cowId1 !== null && cowId2 !== null
  const isCowInPen = cowId1 === cow.id || cowId2 === cow.id
  let newCowBreedingPen = { ...cowBreedingPen }

  if (doAdd) {
    if (isPenFull || isCowInPen) {
      return state
    }

    const cowId = cowId1 === null ? 'cowId1' : 'cowId2'
    newCowBreedingPen = { ...newCowBreedingPen, [cowId]: cow.id }
  } else {
    if (!isCowInPen) {
      return state
    }

    if (cowId1 === cow.id) {
      newCowBreedingPen = {
        ...newCowBreedingPen,
        cowId1: newCowBreedingPen.cowId2,
      }
    }

    newCowBreedingPen = { ...newCowBreedingPen, cowId2: null }
  }

  return {
    ...state,
    cowBreedingPen: {
      ...newCowBreedingPen,
      daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
    },
  }
}

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

  state = removeFieldPlotAt(state, x, y)
  state = addItemToInventory(state, item)
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
      [cropType]: (cropsHarvested[cropType] || 0) + 1,
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

  const spawnedResources = ResourceFactory.instance().generateResources()
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

  if (!plotContent || plotContent.isShoveled) {
    return state
  }

  const item = itemsMap[plotContent.itemId]

  if (item.isReplantable && !doesInventorySpaceRemain(state)) {
    return state
  }

  state = removeFieldPlotAt(state, x, y)

  return item.isReplantable ? addItemToInventory(state, item) : state
}

/**
 * @param {farmhand.state} state
 * @param {number} fieldId
 * @returns {farmhand.state}
 */
export const purchaseField = (state, fieldId) => {
  const { field, money, purchasedField } = state
  if (purchasedField >= fieldId) {
    return state
  }

  const { columns, price, rows } = PURCHASEABLE_FIELD_SIZES.get(fieldId)

  return {
    purchasedField: fieldId,
    field: nullArray(rows).map((_, row) =>
      nullArray(columns).map(
        (_, column) => (field[row] && field[row][column]) || null
      )
    ),
    money: moneyTotal(money, -price),
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const waterPlot = (state, x, y) => {
  const plotContent = state.field[y][x]

  if (!plotContent || getPlotContentType(plotContent) !== itemType.CROP) {
    return state
  }

  return modifyFieldPlotAt(state, x, y, crop => ({
    ...crop,
    wasWateredToday: true,
  }))
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterAllPlots = state => waterField(state)

/**
 * @param {farmhand.state} state
 * @param {number} combineId
 * @returns {farmhand.state}
 */
export const purchaseCombine = (state, combineId) => {
  const { money, purchasedCombine } = state

  if (purchasedCombine >= combineId) {
    return state
  }

  return {
    purchasedCombine: combineId,
    money: moneyTotal(money, -PURCHASEABLE_COMBINES.get(combineId).price),
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} smelterId
 * @returns {farmhand.state}
 */
export const purchaseSmelter = (state, smelterId) => {
  const { money, purchasedSmelter } = state

  if (purchasedSmelter >= smelterId) return state

  state = {
    ...state,
    purchasedSmelter: smelterId,
    money: moneyTotal(money, -PURCHASEABLE_SMELTERS.get(smelterId).price),
  }

  return updateLearnedRecipes(state)
}

/**
 * @param {farmhand.state} state
 * @param {number} cowPenId
 * @returns {farmhand.state}
 */
export const purchaseCowPen = (state, cowPenId) => {
  const { money, purchasedCowPen } = state

  if (purchasedCowPen >= cowPenId) {
    return state
  }

  return {
    purchasedCowPen: cowPenId,
    money: moneyTotal(money, -PURCHASEABLE_COW_PENS.get(cowPenId).price),
  }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const purchaseStorageExpansion = state => {
  const { money, inventoryLimit } = state
  const storageUpgradeCost = getCostOfNextStorageExpansion(inventoryLimit)

  if (money < storageUpgradeCost || inventoryLimit === -1) {
    return state
  }

  return {
    ...state,
    inventoryLimit: inventoryLimit + STORAGE_EXPANSION_AMOUNT,
    money: moneyTotal(money, -storageUpgradeCost),
  }
}

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const hugCow = (state, cowId) =>
  modifyCow(state, cowId, cow =>
    cow.happinessBoostsToday >= MAX_DAILY_COW_HUG_BENEFITS
      ? cow
      : {
          happiness: Math.min(1, cow.happiness + COW_HUG_BENEFIT),
          happinessBoostsToday: cow.happinessBoostsToday + 1,
        }
  )

/**
 * @param {farmhand.state} state
 * @param {string} newName
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const changeCowName = (state, cowId, newName) =>
  modifyCow(state, cowId, () => ({
    name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
  }))

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const selectCow = (state, { id }) => ({ ...state, selectedCowId: id })

/**
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {farmhand.state}
 */
export const updateAchievements = (state, prevState) =>
  achievements.reduce((state, achievement) => {
    if (
      !state.completedAchievements[achievement.id] &&
      achievement.condition(state, prevState)
    ) {
      state = {
        ...achievement.reward(state),
        completedAchievements: {
          ...state.completedAchievements,
          [achievement.id]: true,
        },
      }

      state = showNotification(
        state,
        ACHIEVEMENT_COMPLETED`${achievement}`,
        'success'
      )
    }

    return state
  }, state)

/**
 * @param {farmhand.state} state
 * @param {number} adjustmentAmount This should be a negative number if the
 * loan is being paid down, positive if a loan is being taken out.
 * @returns {farmhand.state}
 */
export const adjustLoan = (state, adjustmentAmount) => {
  const loanBalance = moneyTotal(state.loanBalance, adjustmentAmount)
  const money = moneyTotal(state.money, adjustmentAmount)

  if (loanBalance === 0 && adjustmentAmount < 0) {
    state = showNotification(state, LOAN_PAYOFF``, 'success')
  } else if (adjustmentAmount > 0) {
    // Player is taking out a new loan
    state = {
      ...showNotification(state, LOAN_INCREASED`${loanBalance}`, 'info'),
      loansTakenOut: state.loansTakenOut + 1,
    }
  }

  return {
    ...state,
    loanBalance,
    money,
  }
}

/**
 * @param {farmhand.state} state
 * @param {function(farmhand.state, number, number)} fieldFn
 * @param {number} rangeRadius
 * @param {number} x
 * @param {number} y
 * @param {...any} args Passed to fieldFn.
 * @returns {farmhand.state}
 */
export const forRange = (
  state,
  fieldFn,
  rangeRadius,
  plotX,
  plotY,
  ...args
) => {
  const startX = Math.max(plotX - rangeRadius, 0)
  const endX = Math.min(plotX + rangeRadius, state.field[0].length - 1)
  const startY = Math.max(plotY - rangeRadius, 0)
  const endY = Math.min(plotY + rangeRadius, state.field.length - 1)

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      state = fieldFn(state, x, y, ...args)
    }
  }

  return state
}

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to add
 * @returns {farmhand.state}
 */
export const addPeer = (state, peerId) => {
  const peers = { ...state.peers }
  peers[peerId] = null

  return { ...state, peers }
}

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to remove
 * @returns {farmhand.state}
 */
export const removePeer = (state, peerId) => {
  const peers = { ...state.peers }
  delete peers[peerId]

  return { ...state, peers }
}

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to update
 * @param {Object} state
 * @returns {farmhand.state}
 */
export const updatePeer = (state, peerId, peerState) => {
  const peers = { ...state.peers }
  peers[peerId] = peerState

  // Out of date peer clients may not provide pendingPeerMessages, so default
  // it here.
  const { pendingPeerMessages = [] } = peerState

  return {
    ...state,
    peers,
    latestPeerMessages: [
      ...pendingPeerMessages,
      ...state.latestPeerMessages,
    ].slice(0, MAX_LATEST_PEER_MESSAGES),
  }
}

/**
 * @param {farmhand.state} state
 * @param {string} peerMessage
 * @param {string?} [severity='info']
 * @returns {farmhand.state}
 */
export const prependPendingPeerMessage = (
  state,
  message,
  severity = 'info'
) => {
  return {
    ...state,
    pendingPeerMessages: [
      { id: state.id, message, severity },
      ...state.pendingPeerMessages,
    ].slice(0, MAX_PENDING_PEER_MESSAGES),
  }
}
