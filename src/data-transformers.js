import { itemsMap, recipesMap } from './data/maps'
import {
  canMakeRecipe,
  clampNumber,
  generateCow,
  generateValueAdjustments,
  getCowMilkItem,
  getCowMilkRate,
  getAdjustedItemValue,
  getRangeCoords,
} from './utils'
import {
  COW_FEED_ITEM_ID,
  COW_HUG_BENEFIT,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  CROW_CHANCE,
  FERTILIZER_BONUS,
  RAIN_CHANCE,
  SCARECROW_ITEM_ID,
  SPRINKLER_RANGE,
} from './constants'
import { RAIN_MESSAGE } from './strings'
import { MILK_PRODUCED, CROW_ATTACKED } from './templates'
import { itemType } from './enums'

// TODO: Most or all of the functions in this file that are used externally
// should return a farmhand.state object, and this file should be renamed to
// reducers.js.

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

  return plotContent.type === itemType.CROP
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

///////////////////////////////////////////////////////////
//
// Exported reducers
//
///////////////////////////////////////////////////////////

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyRain = state => ({
  ...state,
  field: getWateredField(state.field),
  newDayNotifications: [...state.newDayNotifications, RAIN_MESSAGE],
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
        if (!plotContent || plotContent.type !== itemType.CROP) {
          return plotContent
        }

        const destroyCrop = Math.random() <= CROW_CHANCE

        if (destroyCrop) {
          newDayNotifications.push(
            CROW_ATTACKED`${itemsMap[plotContent.itemId]}`
          )
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
      if (!plot || plot.type !== itemType.SPRINKLER) {
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

          if (plotContent && plotContent.type === itemType.CROP) {
            if (!crops.has(plotContent)) {
              modifiedField = modifyFieldPlotAt(
                modifiedField,
                x,
                y,
                setWasWatered
              )
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
      newDayNotifications.push(MILK_PRODUCED`${cow}${milk}`)
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
  const { inventory } = state
  const { id } = item
  const newInventory = [...inventory]

  const currentItemSlot = inventory.findIndex(({ id: itemId }) => id === itemId)

  if (~currentItemSlot) {
    const currentItem = inventory[currentItemSlot]

    newInventory[currentItemSlot] = {
      ...currentItem,
      quantity: currentItem.quantity + howMany,
    }
  } else {
    newInventory.push({ id, quantity: howMany })
  }

  return { ...state, inventory: newInventory }
}

const fieldReducer = (acc, fn) => fn(acc)

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
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const getWateredField = field => updateField(field, setWasWatered)

/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {number} x
 * @param {number} y
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const modifyFieldPlotAt = (field, x, y, modifierFn) => {
  const row = [...field[y]]
  const plotContent = modifierFn(row[x])
  row[x] = plotContent
  const modifiedField = [...field]
  modifiedField[y] = row

  return modifiedField
}

/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {number} x
 * @param {number} y
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const removeFieldPlotAt = (field, x, y) =>
  modifyFieldPlotAt(field, x, y, () => null)

/**
 * Invokes a function on every plot in a field.
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {Function(?farmhand.plotContent)} modifierFn
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const updateField = (field, modifierFn) =>
  field.map(row => row.map(modifierFn))

/**
 * @param {string} itemId
 * @param {Array.<farmhand.item>} inventory
 * @param {number} [howMany=1]
 * @returns {Array.<farmhand.item>}
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

export const fieldUpdaters = [incrementCropAge, resetWasWatered]

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

export const processNerfs = state => applyChanceEvent([[1, applyCrows]], state)

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeStateForNextDay = state =>
  [
    processBuffs,
    processNerfs,
    processSprinklers,
    processFeedingCows,
    processMilkingCows,
  ].reduce(
    (acc, fn) => fn({ ...acc }),
    processField(
      computeCowInventoryForNextDay({
        ...state,
        cowForSale: generateCow(),
        dayCount: state.dayCount + 1,
        valueAdjustments: generateValueAdjustments(),
      })
    )
  )

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
      money: money - totalValue,
    },
    item,
    howMany
  )
}

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state} state
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

  return addItemToInventory(
    Object.keys(recipe.ingredients).reduce(
      (state, ingredientId) =>
        decrementItemFromInventory(
          state,
          ingredientId,
          recipe.ingredients[ingredientId]
        ),
      state
    ),
    recipe
  )
}
