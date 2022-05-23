/**
 * @module farmhand.reducers
 * @ignore
 */

import { itemsMap, recipesMap } from '../../data/maps'
import { levels } from '../../data/levels'
import achievements from '../../data/achievements'
import upgrades from '../../data/upgrades'
import {
  areHuggingMachinesInInventory,
  canMakeRecipe,
  castToMoney,
  clampNumber,
  doesInventorySpaceRemain,
  farmProductsSold,
  filterItemIdsToSeeds,
  findCowById,
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
  getLevelEntitlements,
  getPlotContentType,
  getPriceEventForCrop,
  getProfit,
  getRandomLevelUpReward,
  getRandomLevelUpRewardQuantity,
  getRandomUnlockedCrop,
  getResaleValue,
  getSalePriceMultiplier,
  inventorySpaceRemaining,
  isItemAFarmProduct,
  isItemSoldInShop,
  levelAchieved,
  moneyTotal,
  nullArray,
  unlockTool,
} from '../../utils'
import { generateValueAdjustments } from '../../common/utils'
import {
  COW_FEED_ITEM_ID,
  COW_GESTATION_PERIOD_DAYS,
  COW_HUG_BENEFIT,
  COW_MINIMUM_HAPPINESS_TO_BREED,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH,
  HUGGING_MACHINE_ITEM_ID,
  LOAN_GARNISHMENT_RATE,
  LOAN_INTEREST_RATE,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_DAILY_COW_HUG_BENEFITS,
  MAX_LATEST_PEER_MESSAGES,
  MAX_PENDING_PEER_MESSAGES,
  NOTIFICATION_LOG_SIZE,
  PRICE_EVENT_CHANCE,
  PURCHASEABLE_COMBINES,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  PURCHASEABLE_SMELTERS,
  SPRINKLER_ITEM_ID,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants'
import {
  FORGE_AVAILABLE_NOTIFICATION,
  OUT_OF_COW_FEED_NOTIFICATION,
} from '../../strings'
import {
  ACHIEVEMENT_COMPLETED,
  COW_ATTRITION_MESSAGE,
  COW_BORN_MESSAGE,
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
  TOOL_UPGRADED_NOTIFICATION,
} from '../../templates'
import { itemType } from '../../enums'

import { addItemToInventory } from './addItemToInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'
import { showNotification } from './showNotification'
import { processWeather } from './processWeather'
import { processField } from './processField'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'
import { processSprinklers } from './processSprinklers'
import { processNerfs } from './processNerfs'
import { createPriceEvent } from './createPriceEvent'

export * from './addItemToInventory'
export * from './applyCrows'
export * from './applyPrecipitation'
export * from './clearPlot'
export * from './decrementItemFromInventory'
export * from './fertilizePlot'
export * from './harvestPlot'
export * from './incrementPlotContentAge'
export * from './minePlot'
export * from './modifyFieldPlotAt'
export * from './plantInPlot'
export * from './processField'
export * from './processSprinklers'
export * from './processWeather'
export * from './removeFieldPlotAt'
export * from './resetWasShoveled'
export * from './setScarecrow'
export * from './setSprinkler'
export * from './showNotification'
export * from './waterAllPlots'
export * from './waterField'
export * from './processNerfs'
export * from './createPriceEvent'

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
    } else if (levelObject && levelObject.unlocksTool) {
      state.toolLevels = unlockTool(state.toolLevels, levelObject.unlocksTool)
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

///////////////////////////////////////////////////////////
//
// Exported reducers
//
///////////////////////////////////////////////////////////

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
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processCowBreeding = state => {
  const {
    cowBreedingPen,
    cowInventory,
    id,
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

  let offspringCow =
    shouldGenerateOffspring && generateOffspringCow(cow1, cow2, id)

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

/**
 * @param {farmhand.state} state
 * @param {farmhand.upgrade} upgrade
 */
export const upgradeTool = (state, upgrade) => {
  state = makeRecipe(state, upgrade)

  const currentName =
    upgrades[upgrade.toolType][state.toolLevels[upgrade.toolType]].name
  state.toolLevels[upgrade.toolType] = upgrade.level

  state = showNotification(
    state,
    TOOL_UPGRADED_NOTIFICATION`${currentName}${upgrade.name}`
  )

  return { ...state }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const purchaseCow = (state, cow) => {
  const { cowInventory, cowColorsPurchased, id, money, purchasedCowPen } = state
  const { color } = cow
  const cowValue = getCowValue(cow, false)

  if (
    money < cowValue ||
    purchasedCowPen === 0 ||
    cowInventory.length >= PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows
  ) {
    return state
  }

  state = addCowToInventory(state, { ...cow, ownerId: id, originalOwnerId: id })

  return {
    ...state,
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
export const addCowToInventory = (state, cow) => {
  const { cowInventory } = state

  return {
    ...state,
    cowInventory: [...cowInventory, cow],
  }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @returns {farmhand.state}
 */
export const sellCow = (state, cow) => {
  const { cowsSold } = state
  const cowColorId = getCowColorId(cow)
  const cowValue = getCowValue(cow, true)

  state = removeCowFromInventory(state, cow)
  state = addRevenue(state, cowValue)

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

  state = showNotification(state, FORGE_AVAILABLE_NOTIFICATION)

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
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const offerCow = (state, cowId) => {
  state = { ...state, cowIdOfferedForTrade: cowId }

  return state
}

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const withdrawCow = (state, cowId) => {
  const { cowIdOfferedForTrade } = state

  if (cowId === cowIdOfferedForTrade) {
    state = { ...state, cowIdOfferedForTrade: '' }
  }

  return state
}

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
