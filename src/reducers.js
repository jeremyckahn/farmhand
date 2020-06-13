import { itemsMap, recipesMap } from './data/maps'
import achievements from './data/achievements'
import {
  canMakeRecipe,
  clampNumber,
  generateCow,
  generateValueAdjustments,
  getAdjustedItemValue,
  getCowMilkItem,
  getCowMilkRate,
  getCowValue,
  getCropFromItemId,
  getCropLifeStage,
  getFinalCropItemIdFromSeedItemId,
  getPlotContentFromItemId,
  getPlotContentType,
  getPriceEventForCrop,
  getRandomCropItem,
  getRangeCoords,
  isItemAFarmProduct,
  moneyTotal,
} from './utils'
import {
  COW_FEED_ITEM_ID,
  COW_HUG_BENEFIT,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  CROW_CHANCE,
  FERTILIZER_BONUS,
  FERTILIZER_ITEM_ID,
  LOAN_GARNISHMENT_RATE,
  LOAN_INTEREST_RATE,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_DAILY_COW_HUG_BENEFITS,
  NOTIFICATION_LOG_SIZE,
  PRICE_EVENT_CHANCE,
  PURCHASEABLE_COW_PENS,
  PURCHASEABLE_FIELD_SIZES,
  RAIN_CHANCE,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
  SPRINKLER_RANGE,
} from './constants'
import { RAIN_MESSAGE } from './strings'
import {
  ACHIEVEMENT_COMPLETED,
  CROW_ATTACKED,
  LOAN_INCREASED,
  LOAN_PAYOFF,
  MILK_PRODUCED,
  PRICE_CRASH,
  PRICE_SURGE,
} from './templates'
import { cropLifeStage, fieldMode, itemType } from './enums'

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
export const incrementCropAge = crop =>
  crop && {
    ...crop,
    daysOld: crop.daysOld + 1,
    daysWatered:
      crop.daysWatered +
      (crop.wasWateredToday
        ? 1 + (crop.isFertilized ? FERTILIZER_BONUS : 0)
        : 0),
  }

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
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const updateField = (field, modifierFn) =>
  field.map(row => row.map(modifierFn))

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
export const processBuffs = state =>
  applyChanceEvent([[RAIN_CHANCE, applyRain]], state)

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
 * @returns {farmhand.state}
 */
const adjustItemValues = state => ({
  ...state,
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
export const applyRain = state =>
  waterField({
    ...state,
    newDayNotifications: [
      ...state.newDayNotifications,
      { message: RAIN_MESSAGE, severity: 'info' },
    ],
  })

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyCrows = state => {
  const { field } = state
  const newDayNotifications = [...state.newDayNotifications]
  const fieldHasScarecrow = field.some(row =>
    row.some(plot => plot && plot.itemId === SCARECROW_ITEM_ID)
  )

  const updatedField = fieldHasScarecrow
    ? field
    : updateField(field, plotContent => {
        if (!plotContent || getPlotContentType(plotContent) !== itemType.CROP) {
          return plotContent
        }

        const destroyCrop = Math.random() <= CROW_CHANCE

        if (destroyCrop) {
          newDayNotifications.push({
            message: CROW_ATTACKED`${itemsMap[plotContent.itemId]}`,
            severity: 'error',
          })
        }

        return destroyCrop ? null : plotContent
      })

  return { ...state, field: updatedField, newDayNotifications }
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processSprinklers = state => {
  const { field } = state
  const crops = new Map()
  let modifiedField = [...field]

  field.forEach((row, fieldY) => {
    row.forEach((plot, fieldX) => {
      if (!plot || getPlotContentType(plot) !== itemType.SPRINKLER) {
        return
      }

      ;[]
        .concat(
          // Flatten this 2D array for less iteration below
          ...getRangeCoords(SPRINKLER_RANGE, fieldX, fieldY)
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

  return decrementItemFromInventory(
    { ...state, cowInventory, inventory },
    COW_FEED_ITEM_ID,
    unitsSpent
  )
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processMilkingCows = state => {
  const cowInventory = [...state.cowInventory]
  const newDayNotifications = [...state.newDayNotifications]
  const { length: cowInventoryLength } = cowInventory

  for (let i = 0; i < cowInventoryLength; i++) {
    const cow = cowInventory[i]

    if (cow.daysSinceMilking > getCowMilkRate(cow)) {
      cowInventory[i] = { ...cow, daysSinceMilking: 0 }

      const milk = getCowMilkItem(cow)
      state = addItemToInventory(state, milk)
      newDayNotifications.push({
        message: MILK_PRODUCED`${cow}${milk}`,
        severity: 'success',
      })
    }
  }

  return { ...state, cowInventory, newDayNotifications }
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const addItemToInventory = (state, item, howMany = 1) => {
  const { id } = item
  const inventory = [...state.inventory]

  const currentItemSlot = inventory.findIndex(({ id: itemId }) => id === itemId)

  if (~currentItemSlot) {
    const currentItem = inventory[currentItemSlot]

    inventory[currentItemSlot] = {
      ...currentItem,
      quantity: currentItem.quantity + howMany,
    }
  } else {
    inventory.push({ id, quantity: howMany })
  }

  return { ...state, inventory }
}

const fieldReducer = (acc, fn) => fn(acc)
const fieldUpdaters = [incrementCropAge, resetWasWatered]

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
export const computeCowInventoryForNextDay = state => ({
  ...state,
  cowInventory: state.cowInventory.map(cow => ({
    ...cow,
    daysOld: cow.daysOld + 1,
    daysSinceMilking: cow.daysSinceMilking + 1,
    happiness: Math.max(0, cow.happiness - COW_HUG_BENEFIT),
    happinessBoostsToday: 0,
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
    const cropItem = getRandomCropItem()
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

export const applyLoanInterest = state => ({
  ...state,
  loanBalance: state.loanBalance + state.loanBalance * LOAN_INTEREST_RATE,
})

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeStateForNextDay = (state, isFirstDay = false) =>
  (isFirstDay
    ? []
    : [
        computeCowInventoryForNextDay,
        processField,
        processBuffs,
        processNerfs,
        processSprinklers,
        processFeedingCows,
        processMilkingCows,
        updatePriceEvents,
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
    })

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const purchaseItem = (state, item, howMany = 1) => {
  const { money, valueAdjustments } = state
  if (howMany === 0) {
    return state
  }

  const value = getAdjustedItemValue(valueAdjustments, item.id)
  const totalValue = value * howMany

  if (totalValue > money) {
    return state
  }

  return addItemToInventory(
    {
      ...state,
      money: moneyTotal(money, -totalValue),
    },
    item,
    howMany
  )
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @returns {farmhand.state}
 */
export const purchaseItemMax = (state, item) => {
  const { money, valueAdjustments } = state

  return purchaseItem(
    state,
    item,
    Math.floor(money / getAdjustedItemValue(valueAdjustments, item.id))
  )
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
  const { itemsSold, money, valueAdjustments } = state
  let { loanBalance } = state

  const adjustedItemValue = getAdjustedItemValue(valueAdjustments, id)
  const saleIsGarnished = isItemAFarmProduct(item)
  let profit = 0

  for (let i = 0; i < howMany; i++) {
    const loanGarnishment = saleIsGarnished
      ? Math.min(loanBalance, adjustedItemValue * LOAN_GARNISHMENT_RATE)
      : 0
    const garnishedProfit = adjustedItemValue - loanGarnishment
    loanBalance -= loanGarnishment
    profit += garnishedProfit
  }

  if (saleIsGarnished) {
    state = adjustLoan(state, loanBalance - state.loanBalance)
  }

  state = {
    ...state,
    itemsSold: { ...itemsSold, [id]: (itemsSold[id] || 0) + howMany },
    money: moneyTotal(money, profit),
  }

  state = decrementItemFromInventory(state, id, howMany)

  return updateLearnedRecipes(state)
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @returns {farmhand.state}
 */
export const sellAllOfItem = (state, item) => {
  const { id } = item
  const { inventory } = state
  const itemInInventory = inventory.find(item => item.id === id)

  if (!itemInInventory) {
    return state
  }

  return sellItem(state, item, itemInInventory.quantity)
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
 * @returns {farmhand.state}
 */
export const makeRecipe = (state, recipe) => {
  if (!canMakeRecipe(recipe, state.inventory)) {
    return state
  }

  state = Object.keys(recipe.ingredients).reduce(
    (state, ingredientId) =>
      decrementItemFromInventory(
        state,
        ingredientId,
        recipe.ingredients[ingredientId]
      ),
    state
  )

  return addItemToInventory(state, recipe)
}

/**
 * @param {farmhand.state} state
 * @param {string} message
 * @param {string} [severity] Corresponds to the `severity` prop here:
 * https://material-ui.com/api/alert/
 * @returns {farmhand.state}
 */
export const showNotification = (state, message, severity = 'info') => {
  const { notifications } = state

  return {
    ...state,
    // Don't show redundant notifications
    notifications: notifications.find(
      notification => notification.message === message
    )
      ? notifications
      : notifications.concat({ message, severity }),
    doShowNotifications: true,
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

  const cowValue = getCowValue(cow)
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
  const { cowInventory, money } = state
  const cowValue = getCowValue(cow)

  const newCowInventory = [...cowInventory]
  newCowInventory.splice(cowInventory.indexOf(cow), 1)

  return {
    ...state,
    cowInventory: newCowInventory,
    money: moneyTotal(money, cowValue),
  }
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
 * @param {number} x
 * @param {number} y
 * @param {string} plantableItemId
 * @returns {farmhand.state}
 */
export const plantInPlot = (state, x, y, plantableItemId) => {
  if (!plantableItemId) {
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

  return {
    ...state,
    selectedItemId: state.inventory.find(({ id }) => id === plantableItemId)
      ? plantableItemId
      : '',
  }
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const fertilizeCrop = (state, x, y) => {
  const { field } = state
  const row = field[y]
  const crop = row[x]

  if (
    !crop ||
    getPlotContentType(crop) !== itemType.CROP ||
    crop.isFertilized === true
  ) {
    return state
  }

  state = decrementItemFromInventory(state, FERTILIZER_ITEM_ID)

  const doFertilizersRemain = state.inventory.some(
    item => item.id === FERTILIZER_ITEM_ID
  )

  state = modifyFieldPlotAt(state, x, y, crop => ({
    ...crop,
    isFertilized: true,
  }))

  return {
    ...state,
    fieldMode: doFertilizersRemain ? FERTILIZE : OBSERVE,
    selectedItemId: doFertilizersRemain ? FERTILIZER_ITEM_ID : '',
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
    getCropLifeStage(crop) !== GROWN
  ) {
    return state
  }

  state = removeFieldPlotAt(state, x, y)
  return addItemToInventory(state, itemsMap[crop.itemId])
}

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const clearPlot = (state, x, y) => {
  const plotContent = state.field[y][x]

  if (!plotContent) {
    // Nothing planted in state.field[x][y]
    return state
  }

  const item = itemsMap[plotContent.itemId]
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
    field: new Array(rows)
      .fill(null)
      .map((_, row) =>
        new Array(columns)
          .fill(null)
          .map((_, column) => (field[row] && field[row][column]) || null)
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
  modifyCow(state, cowId, cow => ({
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
  const loanBalance = state.loanBalance + adjustmentAmount
  const money = moneyTotal(state.money, adjustmentAmount)

  if (loanBalance === 0 && adjustmentAmount < 0) {
    state = showNotification(state, LOAN_PAYOFF``, 'success')
  } else if (adjustmentAmount > 0) {
    state = showNotification(state, LOAN_INCREASED`${loanBalance}`, 'info')
  }

  return {
    ...state,
    loanBalance,
    money,
  }
}
