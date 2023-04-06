/** @typedef {import("../index").farmhand.crop} farmhand.crop */
/** @typedef {import("../index").farmhand.item} farmhand.item */
/** @typedef {import("../index").farmhand.plotContent} farmhand.plotContent */

/**
 * @module farmhand.utils
 * @ignore
 */

import { Buffer } from 'buffer'

import Dinero from 'dinero.js'
import fastMemoize from 'fast-memoize'
import configureJimp from '@jimp/custom'
import jimpPng from '@jimp/png'
import sortBy from 'lodash.sortby'
import { v4 as uuid } from 'uuid'
import { funAnimalName } from 'fun-animal-names'

import cowShopInventory from '../data/shop-inventory-cow'
import shopInventory from '../data/shop-inventory'
import fruitNames from '../data/fruit-names'
import { cropItemIdToSeedItemMap, itemsMap } from '../data/maps'
import {
  chocolateMilk,
  milk1,
  milk2,
  milk3,
  rainbowMilk1,
  rainbowMilk2,
  rainbowMilk3,
} from '../data/items'
import { levels } from '../data/levels'
import { unlockableItems } from '../data/levels'
import { items as itemImages, animals, pixel } from '../img'
import {
  cowColors,
  cropLifeStage,
  fertilizerType,
  genders,
  itemType,
  stageFocusType,
  standardCowColors,
  toolLevel,
} from '../enums'
import {
  BREAKPOINTS,
  COW_COLORS_HEX_MAP,
  COW_FERTILIZER_PRODUCTION_RATE_FASTEST,
  COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
  COW_MAXIMUM_VALUE_MATURITY_AGE,
  COW_MAXIMUM_VALUE_MULTIPLIER,
  COW_MILK_RATE_FASTEST,
  COW_MILK_RATE_SLOWEST,
  COW_MINIMUM_VALUE_MULTIPLIER,
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH,
  HUGGING_MACHINE_ITEM_ID,
  I_AM_RICH_BONUSES,
  INFINITE_STORAGE_LIMIT,
  INITIAL_FIELD_HEIGHT,
  INITIAL_FIELD_WIDTH,
  INITIAL_SPRINKLER_RANGE,
  INITIAL_STORAGE_LIMIT,
  MALE_COW_WEIGHT_MULTIPLIER,
  MEMOIZE_CACHE_CLEAR_THRESHOLD,
  PEER_METADATA_STATE_KEYS,
  PERSISTED_STATE_KEYS,
  PRECIPITATION_CHANCE,
  PRICE_EVENT_STANDARD_DURATION_DECREASE,
  STORAGE_EXPANSION_AMOUNT,
  STORAGE_EXPANSION_BASE_PRICE,
  STORM_CHANCE,
  STORAGE_EXPANSION_SCALE_PREMIUM,
} from '../constants'
import { random } from '../common/utils'

const Jimp = configureJimp({
  types: [jimpPng],
})

const { SEED, GROWING, GROWN } = cropLifeStage

const purchasableItemMap = [...cowShopInventory, ...shopInventory].reduce(
  (acc, item) => {
    acc[item.id] = item
    return acc
  },
  {}
)

/**
 * @param {Array.<*>} list
 * @return {number}
 */
export const chooseRandomIndex = list =>
  Math.round(random() * (list.length - 1))

/**
 * @param {Array.<*>} list
 * @return {*}
 */
export const chooseRandom = list => list[chooseRandomIndex(list)]

// Ensures that the condition argument to memoize() is not ignored, per
// https://github.com/caiogondim/fast-memoize.js#function-arguments
//
// Pass this is the `serializer` option to any memoize()-ed functions that
// accept function arguments.
const memoizationSerializer = args =>
  JSON.stringify(
    [...args].map(arg => (typeof arg === 'function' ? arg.toString() : arg))
  )

// This is basically the same as fast-memoize's default cache, except that it
// clears the cache once the size exceeds MEMOIZE_CACHE_CLEAR_THRESHOLD to
// prevent memory bloat.
// https://github.com/caiogondim/fast-memoize.js/blob/5cdfc8dde23d86b16e0104bae1b04cd447b98c63/src/index.js#L114-L128
/**
 * @ignore
 */
class MemoizeCache {
  cache = {}

  /**
   * @param {Object} [config] Can also contain the config options used to
   * configure fast-memoize.
   * @param {number} [config.cacheSize]
   * @see https://github.com/caiogondim/fast-memoize.js
   */
  constructor({ cacheSize = MEMOIZE_CACHE_CLEAR_THRESHOLD } = {}) {
    this.cacheSize = cacheSize
  }

  has(key) {
    return key in this.cache
  }

  get(key) {
    return this.cache[key]
  }

  set(key, value) {
    if (Object.keys(this.cache).length > this.cacheSize) {
      this.cache = {}
    }

    this.cache[key] = value
  }
}

export const memoize = (fn, config) =>
  fastMemoize(fn, {
    cache: { create: () => new MemoizeCache(config) },
    ...config,
  })

/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
export const clampNumber = (num, min, max) =>
  num <= min ? min : num >= max ? max : num

export const castToMoney = num => Math.round(num * 100) / 100

/**
 * Safely adds dollar figures to avoid IEEE 754 rounding errors.
 * @param {...number} num Numbers that represent money values.
 * @returns {number}
 * @see http://adripofjavascript.com/blog/drips/avoiding-problems-with-decimal-math-in-javascript.html
 */
export const moneyTotal = (...args) =>
  args.reduce((sum, num) => (sum += Math.round(num * 100)), 0) / 100

/**
 * Based on https://stackoverflow.com/a/14224813/470685
 * @param {number} value Number to scale
 * @param {number} min Non-standard minimum
 * @param {number} max Non-standard maximum
 * @param {number} baseMin Standard minimum
 * @param {number} baseMax Standard maximum
 * @returns {number}
 */
export const scaleNumber = (value, min, max, baseMin, baseMax) =>
  ((value - min) * (baseMax - baseMin)) / (max - min) + baseMin

/**
 * @param {string} string
 * @returns {number}
 */
const convertStringToInteger = string =>
  string.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * i, 0)

export const createNewField = () =>
  new Array(INITIAL_FIELD_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null))

/**
 * @param {number} number
 * @param {string} format
 * @see https://dinerojs.com/module-dinero#~toFormat
 * @returns {string}
 */
const formatNumber = (number, format) =>
  Dinero({ amount: Math.round(number * 100), precision: 2 })
    .convertPrecision(0)
    .toFormat(format)

/**
 * @param {number} number
 * @returns {string} Include dollar sign and other formatting. Cents are
 * rounded off.
 */
export const dollarString = number => formatNumber(number, '$0,0')

/**
 * @param {number} number
 * @returns {string} Number string with commas.
 */
export const integerString = number => formatNumber(number, '0,0')

/**
 * @param {number} number A float
 * @returns {string} the float converted to a full number with a % added
 */
export const percentageString = number => `${Math.round(number * 100)}%`

/**
 * @param {string} itemId
 * @returns {number}
 */
const getItemBaseValue = itemId => itemsMap[itemId].value

/**
 * @param {farmhand.item} item
 * @param {Object.<number>} valueAdjustments
 * @returns {number}
 */
export const getItemCurrentValue = ({ id }, valueAdjustments) =>
  Dinero({
    amount: Math.round(
      (valueAdjustments[id]
        ? getItemBaseValue(id) *
          (itemsMap[id].doesPriceFluctuate ? valueAdjustments[id] : 1)
        : getItemBaseValue(id)) * 100
    ),
    precision: 2,
  }).toUnit()

/**
 * @param {Object} valueAdjustments
 * @param {string} itemId
 * @returns {number} Rounded to a money value.
 */
export const getAdjustedItemValue = (valueAdjustments, itemId) =>
  Number(((valueAdjustments[itemId] || 1) * itemsMap[itemId].value).toFixed(2))

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemSoldInShop = ({ id }) => Boolean(purchasableItemMap[id])

/**
 * @param {farmhand.item} item
 * @returns {number}
 */
export const getResaleValue = ({ id }) => itemsMap[id].value / 2

/**
 * @param {string} itemId
 * @returns {farmhand.plotContent}
 */
export const getPlotContentFromItemId = itemId => ({
  itemId,
  fertilizerType: fertilizerType.NONE,
})

/**
 * @param {string} itemId
 * @returns {farmhand.crop}
 */
export const getCropFromItemId = itemId => ({
  ...getPlotContentFromItemId(itemId),
  daysOld: 0,
  daysWatered: 0,
  fertilizerType: fertilizerType.NONE,
  wasWateredToday: false,
})

/**
 * @param {farmhand.plotContent} plotContent
 * @returns {?string}
 */
export const getPlotContentType = ({ itemId }) =>
  itemId ? itemsMap[itemId].type : null

/**
 * @param {?farmhand.plotContent} plot
 * @returns {boolean}
 */
export const doesPlotContainCrop = plot =>
  plot && getPlotContentType(plot) === itemType.CROP

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAGrownCrop = item =>
  Boolean(item.type === itemType.CROP && !item.growsInto)

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAFarmProduct = item =>
  Boolean(
    isItemAGrownCrop(item) ||
      item.type === itemType.MILK ||
      item.type === itemType.CRAFTED_ITEM
  )

/**
 * @param {farmhand.crop} crop
 * @returns {number}
 */
export const getCropLifecycleDuration = memoize(({ cropTimetable }) =>
  Object.values(cropTimetable).reduce((acc, value) => acc + value, 0)
)

/**
 * @param {farmhand.cropTimetable} cropTimetable
 * @returns {Array.<enums.cropLifeStage>}
 */
export const getLifeStageRange = memoize(cropTimetable =>
  [SEED, GROWING].reduce(
    (acc, stage) => acc.concat(Array(cropTimetable[stage]).fill(stage)),
    []
  )
)

/**
 * @param {farmhand.crop} crop
 * @returns {enums.cropLifeStage}
 */
export const getCropLifeStage = ({ itemId, daysWatered }) =>
  getLifeStageRange(itemsMap[itemId].cropTimetable)[Math.floor(daysWatered)] ||
  GROWN

/**
 * @param {farmhand.plotContent} plotContent
 * @param {number} x
 * @param {number} y
 * @returns {?string}
 */
export const getPlotImage = (plotContent, x, y) => {
  if (plotContent) {
    if (getPlotContentType(plotContent) === itemType.CROP) {
      let itemImageId
      switch (getCropLifeStage(plotContent)) {
        case GROWN:
          itemImageId = plotContent.itemId
          break

        case GROWING:
          itemImageId = `${plotContent.itemId}-growing`
          break

        default:
          const seedItem = cropItemIdToSeedItemMap[plotContent.itemId]
          itemImageId = seedItem.id
      }

      return itemImages[itemImageId]
    }

    if (getPlotContentType(plotContent) === itemType.WEED) {
      const weedColors = ['yellow', 'orange', 'pink']
      const color = weedColors[(x * y) % weedColors.length]

      return itemImages[`weed-${color}`]
    } else if (plotContent?.oreId) {
      return itemImages[plotContent.oreId]
    } else {
      return itemImages[plotContent.itemId]
    }
  }

  return null
}

/**
 * @param {number} rangeSize
 * @param {number} centerX
 * @param {number} centerY
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const getRangeCoords = (rangeSize, centerX, centerY) => {
  const squareSize = 2 * rangeSize + 1
  const rangeStartX = centerX - rangeSize
  const rangeStartY = centerY - rangeSize

  return new Array(squareSize)
    .fill()
    .map((_, y) =>
      new Array(squareSize)
        .fill()
        .map((_, x) => ({ x: rangeStartX + x, y: rangeStartY + y }))
    )
}

/**
 * @param {farmhand.item} item
 * @param {number} [variationIdx=0]
 * @returns {farmhand.item}
 */
export const getFinalCropItemFromSeedItem = ({ id }, variantIdx = 0) =>
  itemsMap[getFinalCropItemIdFromSeedItemId(id, variantIdx)]

/**
 * @param {string} seedItemId
 * @param {number} [variationIdx]
 * @returns {string}
 */
export const getFinalCropItemIdFromSeedItemId = (
  seedItemId,
  variationIdx = 0
) => {
  const { growsInto } = itemsMap[seedItemId]

  if (Array.isArray(growsInto)) {
    return growsInto[variationIdx]
  } else {
    return growsInto
  }
}

/**
 * @param {string} cropItemId
 * @returns {string}
 */
export const getSeedItemIdFromFinalStageCropItemId = memoize(
  cropItemId => {
    return Object.values(itemsMap).find(({ growsInto }) => {
      if (Array.isArray(growsInto)) {
        return growsInto.includes(cropItemId)
      } else {
        return growsInto === cropItemId
      }
    }).id
  },
  {
    cacheSize: Object.keys(itemsMap).length,
  }
)

/**
 * @param {farmhand.cow} cow
 * @returns {string}
 */
const getDefaultCowName = ({ id }) =>
  fruitNames[convertStringToInteger(id) % fruitNames.length]

/**
 * @param {farmhand.cow} cow
 * @param {string} playerId
 * @param {boolean} allowCustomPeerCowNames
 * @returns {string}
 */
export const getCowDisplayName = (cow, playerId, allowCustomPeerCowNames) => {
  return cow.originalOwnerId !== playerId && !allowCustomPeerCowNames
    ? getDefaultCowName(cow)
    : cow.name
}

/**
 * Generates a friendly cow.
 * @param {Object} [options]
 * @returns {farmhand.cow}
 */
export const generateCow = (options = {}) => {
  const gender = options.gender || chooseRandom(Object.values(genders))
  const color = options.color || chooseRandom(Object.values(standardCowColors))
  const id = options.id || uuid()

  const baseWeight = Math.round(
    COW_STARTING_WEIGHT_BASE *
      (gender === genders.MALE ? MALE_COW_WEIGHT_MULTIPLIER : 1) -
      COW_STARTING_WEIGHT_VARIANCE +
      random() * (COW_STARTING_WEIGHT_VARIANCE * 2)
  )

  const cow = {
    baseWeight,
    color,
    colorsInBloodline: { [color]: true },
    daysOld: 1,
    daysSinceMilking: 0,
    daysSinceProducingFertilizer: 0,
    gender,
    happiness: 0,
    happinessBoostsToday: 0,
    id,
    isBred: false,
    isUsingHuggingMachine: false,
    name: '',
    ownerId: '',
    originalOwnerId: '',
    timesTraded: 0,
    weightMultiplier: 1,
    ...options,
  }

  cow.name = getDefaultCowName(cow)

  return cow
}

/**
 * Generates a cow based on two parents.
 * @param {farmhand.cow} cow1
 * @param {farmhand.cow} cow2
 * @param {string} ownerId
 * @param {Partial<farmhand.cow>?} customProps
 * @returns {farmhand.cow}
 */
export const generateOffspringCow = (cow1, cow2, ownerId, customProps = {}) => {
  if (cow1.gender === cow2.gender) {
    throw new Error(
      `${JSON.stringify(cow1)} ${JSON.stringify(
        cow2
      )} cannot produce offspring because they have the same gender`
    )
  }

  const maleCow = cow1.gender === genders.MALE ? cow1 : cow2
  const femaleCow = cow1.gender === genders.MALE ? cow2 : cow1
  const colorsInBloodline = {
    // These lines are for backwards compatibility and can be removed on 11/1/2020
    [maleCow.color]: true,
    [femaleCow.color]: true,
    // End backwards compatibility lines to remove
    ...maleCow.colorsInBloodline,
    ...femaleCow.colorsInBloodline,
  }

  delete colorsInBloodline[cowColors.RAINBOW]

  const isRainbowCow =
    Object.keys(colorsInBloodline).length ===
    Object.keys(standardCowColors).length

  return generateCow({
    color: isRainbowCow
      ? cowColors.RAINBOW
      : chooseRandom([femaleCow.color, maleCow.color]),
    colorsInBloodline,
    baseWeight: (maleCow.baseWeight + femaleCow.baseWeight) / 2,
    isBred: true,
    ownerId,
    originalOwnerId: ownerId,
    ...customProps,
  })
}

/**
 * @param {farmhand.cow} cow
 * @returns {farmhand.item}
 */
export const getCowMilkItem = ({ color, happiness }) => {
  if (color === cowColors.BROWN) {
    return chocolateMilk
  }

  const isRainbowCow = color === cowColors.RAINBOW

  if (happiness < 1 / 3) {
    return isRainbowCow ? rainbowMilk1 : milk1
  } else if (happiness < 2 / 3) {
    return isRainbowCow ? rainbowMilk2 : milk2
  }

  return isRainbowCow ? rainbowMilk3 : milk3
}

/**
 * @param {farmhand.cow} cow
 * @returns {farmhand.item}
 */
export const getCowFertilizerItem = ({ color }) =>
  itemsMap[color === cowColors.RAINBOW ? 'rainbow-fertilizer' : 'fertilizer']

/**
 * @param {farmhand.cow} cow
 * @returns {number}
 */
export const getCowMilkRate = cow =>
  cow.gender === genders.FEMALE
    ? scaleNumber(
        cow.weightMultiplier,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM,
        COW_MILK_RATE_SLOWEST,
        COW_MILK_RATE_FASTEST
      )
    : Infinity

/**
 * @param {farmhand.cow} cow
 * @returns {number}
 */
export const getCowFertilizerProductionRate = cow =>
  cow.gender === genders.MALE
    ? scaleNumber(
        cow.weightMultiplier,
        COW_WEIGHT_MULTIPLIER_MINIMUM,
        COW_WEIGHT_MULTIPLIER_MAXIMUM,
        COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
        COW_FERTILIZER_PRODUCTION_RATE_FASTEST
      )
    : Infinity

/**
 * @param {farmhand.cow} cow
 * @returns {number}
 */
export const getCowWeight = ({ baseWeight, weightMultiplier }) =>
  Math.round(baseWeight * weightMultiplier)

/**
 * @param {farmhand.cow} cow
 * @param {boolean} [computeSaleValue=false]
 * @returns {number}
 */
export const getCowValue = (cow, computeSaleValue = false) =>
  computeSaleValue
    ? getCowWeight(cow) *
      clampNumber(
        scaleNumber(
          cow.daysOld,
          1,
          COW_MAXIMUM_VALUE_MATURITY_AGE,
          COW_MINIMUM_VALUE_MULTIPLIER,
          COW_MAXIMUM_VALUE_MULTIPLIER
        ),
        COW_MINIMUM_VALUE_MULTIPLIER,
        COW_MAXIMUM_VALUE_MULTIPLIER
      )
    : getCowWeight(cow) * 1.5

export const getCowSellValue = cow => getCowValue(cow, true)

/**
 * @param {Array.<farmhand.item>} inventory
 * @returns {Object}
 */
export const getInventoryQuantityMap = memoize(inventory =>
  inventory.reduce((acc, { id, quantity }) => {
    acc[id] = quantity
    return acc
  }, {})
)

/**
 * @param {farmhand.recipe} recipe
 * @param {Array.<farmhand.item>} inventory
 * @returns {number}
 */
export const maxYieldOfRecipe = memoize(({ ingredients }, inventory) => {
  const inventoryQuantityMap = getInventoryQuantityMap(inventory)

  return (
    Math.min(
      ...Object.keys(ingredients).map(itemId =>
        Math.floor(inventoryQuantityMap[itemId] / ingredients[itemId])
      )
    ) || 0
  )
})

/**
 * @param {farmhand.recipe} recipe
 * @param {Array.<farmhand.item>} inventory
 * @param {number} howMany
 * @returns {boolean}
 */
export const canMakeRecipe = (recipe, inventory, howMany) =>
  maxYieldOfRecipe(recipe, inventory) >= howMany

/**
 * @param {Array.<string>} itemIds
 * @returns {Array.<string>}
 */
export const filterItemIdsToSeeds = itemsIds =>
  itemsIds.filter(id => itemsMap[id].type === itemType.CROP)

/**
 * @param {Array.<string>} unlockedSeedItemIds
 * @returns {farmhand.item}
 */
export const getRandomUnlockedCrop = unlockedSeedItemIds => {
  const seedItemId = chooseRandom(unlockedSeedItemIds)
  const seedItem = itemsMap[seedItemId]
  const variationIdx = Array.isArray(seedItem.growsInto)
    ? chooseRandomIndex(seedItem.growsInto)
    : 0

  const cropItem =
    itemsMap[getFinalCropItemIdFromSeedItemId(seedItemId, variationIdx)]

  return cropItem
}

/**
 * @param {farmhand.item} cropItem
 * @returns {farmhand.priceEvent}
 */
export const getPriceEventForCrop = cropItem => ({
  itemId: cropItem.id,
  daysRemaining:
    getCropLifecycleDuration(cropItem) - PRICE_EVENT_STANDARD_DURATION_DECREASE,
})

/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {function(?farmhand.plotContent)} condition
 * @returns {?farmhand.plotContent}
 */
export const findInField = memoize(
  (field, condition) => field.find(row => row.find(condition)) || null,
  {
    serializer: memoizationSerializer,
  }
)

// This is currently unused, but it could be useful later.
/**
 * @param {Array.<Array.<?farmhand.plotContent>>} field
 * @param {function(?farmhand.plotContent)} filterCondition
 * @returns {Array.<Array.<?farmhand.plotContent>>}
 */
export const getCrops = memoize(
  (field, filterCondition) =>
    field.reduce((acc, row) => {
      acc.push(...row.filter(filterCondition))

      return acc
    }, []),
  {
    serializer: memoizationSerializer,
  }
)

/**
 * @returns {boolean}
 */
export const doesMenuObstructStage = () => window.innerWidth < BREAKPOINTS.MD

const itemTypesToShowInReverse = new Set([itemType.MILK])

const sortItemIdsByTypeAndValue = memoize(itemIds =>
  sortBy(itemIds, [
    id => Number(itemsMap[id].type !== itemType.CROP),
    id => {
      const { type, value } = itemsMap[id]
      return itemTypesToShowInReverse.has(type) ? -value : value
    },
  ])
)

/**
 * @param {Array.<farmhand.item>} items
 * @return {Array.<farmhand.item>}
 */
export const sortItems = items => {
  const map = {}
  items.forEach(item => (map[item.id] = item))

  return sortItemIdsByTypeAndValue(items.map(({ id }) => id)).map(id => map[id])
}

/**
 * @param {Array.<farmhand.item>} inventory
 * @returns {number}
 */
export const inventorySpaceConsumed = memoize(inventory =>
  inventory.reduce((sum, { quantity }) => sum + quantity, 0)
)

/**
 * @param {{ inventory: Array.<farmhand.item>, inventoryLimit: number}} state
 * @returns {number}
 */
export const inventorySpaceRemaining = ({ inventory, inventoryLimit }) =>
  inventoryLimit === INFINITE_STORAGE_LIMIT
    ? Infinity
    : Math.max(0, inventoryLimit - inventorySpaceConsumed(inventory))

/**
 * @param {{ inventory: Array.<farmhand.item>, inventoryLimit: number}} state
 * @returns {boolean}
 */
export const doesInventorySpaceRemain = ({ inventory, inventoryLimit }) =>
  inventorySpaceRemaining({ inventory, inventoryLimit }) > 0

/**
 * @param {Array.<farmhand.item>} inventory
 * @return {boolean}
 */
export const areHuggingMachinesInInventory = memoize(inventory =>
  inventory.some(({ id }) => id === HUGGING_MACHINE_ITEM_ID)
)

/**
 * @param {number} arraySize
 * @returns {Array.<null>}
 */
export const nullArray = memoize(
  arraySize => Object.freeze(new Array(arraySize).fill(null)),
  {
    cacheSize: 30,
  }
)

/**
 * @param {Array.<farmhand.cow>} cowInventory
 * @param {string} id
 * @returns {farmhand.cow|undefined}
 */
export const findCowById = memoize((cowInventory, id) =>
  cowInventory.find(cow => id === cow.id)
)

/**
 * @param {Object.<number>} itemsSold
 * @returns {number}
 */
export const farmProductsSold = memoize(itemsSold =>
  Object.entries(itemsSold).reduce(
    (sum, [itemId, numberSold]) =>
      sum + (isItemAFarmProduct(itemsMap[itemId]) ? numberSold : 0),
    0
  )
)

/**
 * @param {number} farmProductsSold
 * @returns {number}
 */
export const levelAchieved = farmProductsSold =>
  Math.floor(Math.sqrt(farmProductsSold) / 10) + 1

/**
 * @param {number} targetLevel
 * @returns {number}
 */
export const farmProductSalesVolumeNeededForLevel = targetLevel =>
  ((targetLevel - 1) * 10) ** 2

/**
 * @param {number} levelNumber
 * @returns {Object} Contains `sprinklerRange` and keys that correspond to
 * unlocked items.
 */
export const getLevelEntitlements = memoize(levelNumber => {
  const acc = {
    sprinklerRange: INITIAL_SPRINKLER_RANGE,
    items: {},
    tools: {},
  }

  // Assumes that levels is sorted by id.
  levels.find(
    ({ unlocksShopItem, unlocksTool, id, increasesSprinklerRange }) => {
      if (increasesSprinklerRange) {
        acc.sprinklerRange++
      }

      if (unlocksShopItem) {
        acc.items[unlocksShopItem] = true
      }

      if (unlocksTool) {
        acc.tools[unlocksTool] = true
      }

      return id === levelNumber
    }
  )

  return acc
})

/**
 * @param {Object} levelEntitlements
 * @returns {Array.<{ item: farmhand.item }>}
 */
export const getAvailableShopInventory = memoize(levelEntitlements =>
  shopInventory.filter(
    ({ id }) =>
      !(
        unlockableItems.hasOwnProperty(id) &&
        !levelEntitlements.items.hasOwnProperty(id)
      )
  )
)

/**
 * @param {number} level
 * @returns {farmhand.item} Will always be a crop seed item.
 */
export const getRandomLevelUpReward = level =>
  itemsMap[
    chooseRandom(
      filterItemIdsToSeeds(Object.keys(getLevelEntitlements(level).items))
    )
  ]

/**
 * @param {number} level
 * @returns {number}
 */
export const getRandomLevelUpRewardQuantity = level => level * 10

/**
 * @param {farmhand.state} state
 * @returns {Object} Data that is meant to be shared with Trystero peers.
 */
export const getPeerMetadata = state => {
  const reducedState = PEER_METADATA_STATE_KEYS.reduce((acc, key) => {
    acc[key] = state[key]

    return acc
  }, {})

  Object.assign(reducedState, {
    cowOfferedForTrade: state.cowInventory.find(
      ({ id }) => id === state.cowIdOfferedForTrade
    ),
  })

  return reducedState
}

/**
 * @param {Object} state
 * @returns {Object} A version of `state` that only contains keys of
 * farmhand.state data that should be persisted.
 */
export const reduceByPersistedKeys = state =>
  PERSISTED_STATE_KEYS.reduce((acc, key) => {
    // This check prevents old exports from corrupting game state when
    // imported.
    if (typeof state[key] !== 'undefined') {
      acc[key] = state[key]
    }

    return acc
  }, {})

/**
 * @param {Array.<number>} historicalData Must be no longer than 7 numbers long.
 * @return {number}
 */
export const get7DayAverage = historicalData =>
  historicalData.reduce((sum, revenue) => moneyTotal(sum, revenue), 0) /
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH

const cowColorToIdMap = {
  [cowColors.BLUE]: 'blue',
  [cowColors.BROWN]: 'brown',
  [cowColors.GREEN]: 'green',
  [cowColors.ORANGE]: 'orange',
  [cowColors.PURPLE]: 'purple',
  [cowColors.RAINBOW]: 'rainbow',
  [cowColors.WHITE]: 'white',
  [cowColors.YELLOW]: 'yellow',
}

export const getCowColorId = ({ color }) => `${cowColorToIdMap[color]}-cow`

/**
 * @param {number} revenue
 * @param {number} losses
 * @return {number}
 */
export const getProfit = (revenue, losses) => moneyTotal(revenue, losses)

/**
 * @param {number} recordSingleDayProfit
 * @param {number} todaysRevenue
 * @param {number} todaysLosses
 * @returns {number}
 */
export const getProfitRecord = (
  recordSingleDayProfit,
  todaysRevenue,
  todaysLosses
) => Math.max(recordSingleDayProfit, getProfit(todaysRevenue, todaysLosses))

/**
 * @param {Object} todaysStartingInventory
 * @param {Object} todaysPurchases
 * @param {Array.<{ id: farmhand.item, quantity: number }>} inventory
 * @return {Object} Keys are item IDs, values are either 1 or -1.
 */
export const computeMarketPositions = (
  todaysStartingInventory,
  todaysPurchases,
  inventory
) =>
  inventory.reduce((acc, { id, quantity: endingPosition }) => {
    const startingInventory = todaysStartingInventory[id] || 0
    const purchaseQuantity = todaysPurchases[id] || 0

    if (!itemsMap[id].doesPriceFluctuate) {
      return acc
    }

    if (startingInventory !== endingPosition) {
      if (
        endingPosition < startingInventory ||
        endingPosition < purchaseQuantity
      ) {
        acc[id] = -1
      } else if (
        endingPosition > startingInventory ||
        endingPosition > purchaseQuantity
      ) {
        acc[id] = 1
      }
    }

    return acc
  }, {})

/**
 * @param {Object.<farmhand.module:enums.toolType, farmhand.module:enums.toolLevel>} currentToolLevels
 * @param {farmhand.module:enums.toolType} toolType
 * @returns {farmhand.state}
 */
export const unlockTool = (currentToolLevels, toolType) => {
  if (currentToolLevels[toolType] === toolLevel.UNAVAILABLE) {
    return Object.assign({}, currentToolLevels, {
      [toolType]: toolLevel.DEFAULT,
    })
  }

  return currentToolLevels
}

/**
 * @param {Farmhand.state} state
 * @return {Object}
 */
export const transformStateDataForImport = state => {
  const sanitizedState = { ...state }
  const { id } = sanitizedState

  const rejectedKeys = ['version']
  rejectedKeys.forEach(rejectedKey => delete sanitizedState[rejectedKey])

  // Update old data models

  if (sanitizedState.field) {
    // Update plot data
    sanitizedState.field = sanitizedState.field.map(row =>
      row.map(plot => {
        if (plot === null) {
          return null
        }

        const { isFertilized, ...rest } = plot

        return {
          ...rest,

          // Convert from isFertilized (boolean) to fertilizerType (enum)
          fertilizerType:
            rest.fertilizerType ||
            (isFertilized ? fertilizerType.STANDARD : fertilizerType.NONE),
        }
      })
    )
  }

  const { tools: unlockedTools } = getLevelEntitlements(
    levelAchieved(farmProductsSold(sanitizedState.itemsSold))
  )

  for (const tool of Object.keys(unlockedTools)) {
    sanitizedState.toolLevels = unlockTool(sanitizedState.toolLevels, tool)
  }

  if (
    !sanitizedState.showHomeScreen &&
    sanitizedState.stageFocus === stageFocusType.HOME
  ) {
    sanitizedState.stageFocus = stageFocusType.SHOP
  }

  // TODO: Remove these cowInventory and cowForSale transformations after
  // 3/15/2023
  sanitizedState.cowInventory = sanitizedState.cowInventory.map(cow => ({
    ownerId: id,
    originalOwnerId: id,
    timesTraded: 0,
    ...cow,
  }))

  sanitizedState.cowForSale = {
    ownerId: '',
    originalOwnerId: '',
    timesTraded: 0,
    ...sanitizedState.cowForSale,
  }

  return sanitizedState
}

/**
 * @param {string} playerId
 * @returns {string}
 */
export const getPlayerName = memoize(playerId => {
  return funAnimalName(playerId)
})

/**
 * @param {number} currentInventoryLimit
 * @returns {number}
 */
export const getCostOfNextStorageExpansion = currentInventoryLimit => {
  const upgradesPurchased =
    (currentInventoryLimit - INITIAL_STORAGE_LIMIT) / STORAGE_EXPANSION_AMOUNT

  return (
    STORAGE_EXPANSION_BASE_PRICE +
    upgradesPurchased * STORAGE_EXPANSION_SCALE_PREMIUM
  )
}

/**
 * Create a no-op Promise that resolves in a specified amount of time.
 * @returns {Promise}
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * @param {object} completedAchievements from game state
 * @returns {number} multiplier to be used for sales price adjustments based on completedAchievements
 */
export const getSalePriceMultiplier = (completedAchievements = {}) => {
  let salePriceMultiplier = 1

  if (completedAchievements['i-am-rich-3']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[2]
  } else if (completedAchievements['i-am-rich-2']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[1]
  } else if (completedAchievements['i-am-rich-1']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[0]
  }

  return salePriceMultiplier
}

/**
 * @param {Array} weightedOptions an array of objects each containing a `weight` property
 * @returns {Object} one of the items from weightedOptions
 */
export function randomChoice(weightedOptions) {
  let totalWeight = 0
  let sortedOptions = []

  for (let option of weightedOptions) {
    totalWeight += option.weight
    sortedOptions.push(option)
  }

  sortedOptions.sort(o => o.weight)

  let diceRoll = random() * totalWeight
  let option
  let runningTotal = 0

  for (let i in sortedOptions) {
    option = sortedOptions[i]

    if (diceRoll < option.weight + runningTotal) {
      return option
    }

    runningTotal += option.weight
  }
}

const colorizeCowTemplate = (() => {
  const cowImageWidth = 48
  const cowImageHeight = 48
  const cowImageFactoryCanvas = document.createElement('canvas')
  cowImageFactoryCanvas.setAttribute('height', cowImageHeight)
  cowImageFactoryCanvas.setAttribute('width', cowImageWidth)

  const cachedCowImages = {}

  // https://stackoverflow.com/a/5624139
  const hexToRgb = memoize(hex => {
    const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
    }
  })

  /**
   * @param {string} cowTemplate Base64 representation of an image
   * @param {string} color
   * @returns {string} Base64 representation of an image
   */
  return async (cowTemplate, color) => {
    if (color === cowColors.RAINBOW) return animals.cow.rainbow

    const imageKey = `${color}_${cowTemplate}`

    if (cachedCowImages[imageKey]) return cachedCowImages[imageKey]

    try {
      // `data:image/png;base64,` needs to be removed from the base64 string
      // before being provided to Buffer.
      // https://github.com/oliver-moran/jimp/issues/231#issuecomment-282167737
      const cowTemplateBuffer = Buffer.from(
        cowTemplate.split(',')[1] ?? '',
        'base64'
      )
      const image = await Jimp.read(cowTemplateBuffer)

      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y) {
        const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))

        // rgb(102, 102, 102) represents the color to replace in the template
        // source images (#666).
        if (r === 102 && g === 102 && b === 102) {
          const cowColorRgb = hexToRgb(COW_COLORS_HEX_MAP[color])
          const colorNumber = Jimp.rgbaToInt(
            cowColorRgb.r,
            cowColorRgb.g,
            cowColorRgb.b,
            255
          )

          image.setPixelColor(colorNumber, x, y)
        }
      })

      cachedCowImages[imageKey] = await image.getBase64Async(Jimp.MIME_PNG)

      return cachedCowImages[imageKey]
    } catch (e) {
      // Jimp.read() expectedly errors out when it receives an empty buffer,
      // which it will in some unit tests.
      if (process.env.NODE_ENV !== 'test') {
        console.error(e)
      }

      return pixel
    }
  }
})()

/**
 * @param {farmhand.cow} cow
 * @returns {string} Base64 representation of an image
 */
export const getCowImage = async cow => {
  const cowIdNumber = convertStringToInteger(cow.id)
  const { variations } = animals.cow
  const cowTemplate = variations[cowIdNumber % variations.length]

  return await colorizeCowTemplate(cowTemplate, cow.color)
}

/**
 * Adapted from https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
 * @param {Element} element
 * @returns {boolean}
 */
export const isInViewport = element => {
  const { top, left, bottom, right } = element.getBoundingClientRect()

  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const shouldPrecipitateToday = () => random() < PRECIPITATION_CHANCE
export const shouldStormToday = () => random() < STORM_CHANCE

/**
 * @param {farmhand.cow} cow
 * @param {farmhand.cowBreedingPen} cowBreedingPen
 * @returns {boolean}
 */
export const isCowInBreedingPen = (cow, cowBreedingPen) =>
  cowBreedingPen.cowId1 === cow.id || cowBreedingPen.cowId2 === cow.id

/**
 * @returns {boolean}
 */
export const isOctober = () => new Date().getMonth() === 9

/**
 * @returns {boolean}
 */
export const isDecember = () => new Date().getMonth() === 11

export { default as isRandomNumberLessThan } from './isRandomNumberLessThan'
export { default as totalIngredientsInRecipe } from './totalIngredientsInRecipe'
