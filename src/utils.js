import Dinero from 'dinero.js'
import memoize from 'fast-memoize'

import fruitNames from './data/fruit-names'
import { cropIdToTypeMap, itemsMap } from './data/maps'
import { milk1, milk2, milk3 } from './data/items'
import { items as itemImages } from './img'
import { cowColors, cropLifeStage, genders, itemType } from './enums'
import {
  COW_MAXIMUM_AGE_VALUE_DROPOFF,
  COW_MAXIMUM_VALUE_MULTIPLIER,
  COW_MILK_RATE_FASTEST,
  COW_MILK_RATE_SLOWEST,
  COW_MINIMUM_VALUE_MULTIPLIER,
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  INITIAL_FIELD_HEIGHT,
  INITIAL_FIELD_WIDTH,
  MALE_COW_WEIGHT_MULTIPLIER,
} from './constants'

const { SEED, GROWING, GROWN } = cropLifeStage

const chooseRandom = list => list[Math.round(Math.random() * (list.length - 1))]

/**
 * @returns {string}
 */
const createUniqueId = () => btoa(Math.random() + Date.now())

/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
export const clampNumber = (num, min, max) =>
  num <= min ? min : num >= max ? max : num

/**
 * Based on https://stackoverflow.com/a/14224813/470685
 * @param {number} value Number to scale
 * @param {number} min Non-standard minimum
 * @param {number} max Non-standard maximum
 * @param {number} baseMin Standard minimum
 * @param {number} baseMax Standard maximum
 * @return {number}
 */
const scaleNumber = (value, min, max, baseMin, baseMax) =>
  ((value - min) * (baseMax - baseMin)) / (max - min) + baseMin

export const createNewField = () =>
  new Array(INITIAL_FIELD_HEIGHT)
    .fill(undefined)
    .map(() => new Array(INITIAL_FIELD_WIDTH).fill(null))

/**
 * @param {number} number
 * @returns {string} Does not include dollar sign.
 */
export const dollarAmount = number =>
  Dinero({
    amount: Math.round(number * 100),
    precision: 2,
  })
    .toUnit()
    .toFixed(2)

/**
 * @param {farmhand.item} item
 * @param {Object.<number>} valueAdjustments
 * @returns {number}
 */
export const getItemValue = ({ id }, valueAdjustments) =>
  Dinero({
    amount: Math.round(
      (valueAdjustments[id]
        ? itemsMap[id].value *
          (itemsMap[id].doesPriceFluctuate ? valueAdjustments[id] : 1)
        : itemsMap[id].value) * 100
    ),
    precision: 2,
  }).toUnit()

/**
 * @param {string} itemId
 * @returns {farmhand.crop}
 */
export const getCropFromItemId = itemId => ({
  ...getPlotContentFromItemId(itemId),
  daysOld: 0,
  daysWatered: 0,
  isFertilized: false,
  type: itemType.CROP,
  wasWateredToday: false,
})

/**
 * @param {string} itemId
 * @returns {farmhand.plotContent}
 */
export const getPlotContentFromItemId = itemId => ({
  itemId,
  type: itemsMap[itemId].type,
})

/**
 * @param {farmhand.crop} crop
 * @return {string}
 */
export const getCropId = ({ itemId }) =>
  cropIdToTypeMap[itemsMap[itemId].cropType]

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

const cropLifeStageToImageSuffixMap = {
  [SEED]: 'seed',
  [GROWING]: 'growing',
}

/**
 * @param {farmhand.plotContent} plotContent
 * @returns {?string}
 */
export const getPlotImage = plotContent =>
  plotContent
    ? plotContent.type === itemType.CROP
      ? getCropLifeStage(plotContent) === GROWN
        ? itemImages[getCropId(plotContent)]
        : itemImages[
            `${getCropId(plotContent)}-${
              cropLifeStageToImageSuffixMap[getCropLifeStage(plotContent)]
            }`
          ]
      : itemImages[plotContent.itemId]
    : null

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
 * @param {Object} valueAdjustments
 * @param {string} itemId
 * @returns {number}
 */
export const getAdjustedItemValue = (valueAdjustments, itemId) =>
  (valueAdjustments[itemId] || 1) * itemsMap[itemId].value

/**
 * Generates a friendly cow.
 * @param {Object} [options]
 * @returns {farmhand.cow}
 */
export const generateCow = (options = {}) => {
  const gender = options.gender || chooseRandom(Object.values(genders))

  const baseWeight = Math.round(
    COW_STARTING_WEIGHT_BASE *
      (gender === genders.MALE ? MALE_COW_WEIGHT_MULTIPLIER : 1) -
      COW_STARTING_WEIGHT_VARIANCE +
      Math.random() * (COW_STARTING_WEIGHT_VARIANCE * 2)
  )

  return {
    baseWeight,
    color: chooseRandom(Object.values(cowColors)),
    daysOld: 1,
    daysSinceMilking: 0,
    gender,
    happiness: 0,
    happinessBoostsToday: 0,
    id: createUniqueId(),
    name: chooseRandom(fruitNames),
    weightMultiplier: 1,
    ...options,
  }
}

/**
 * @param {farmhand.cow} cow
 * @returns {farmhand.item}
 */
export const getCowMilkItem = ({ happiness }) => {
  if (happiness < 1 / 3) {
    return milk1
  } else if (happiness < 2 / 3) {
    return milk2
  }

  return milk3
}

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
export const getCowWeight = ({ baseWeight, weightMultiplier }) =>
  Math.round(baseWeight * weightMultiplier)

/**
 * @param {farmhand.cow} cow
 * @returns {number}
 */
export const getCowValue = cow =>
  getCowWeight(cow) *
  clampNumber(
    scaleNumber(
      cow.daysOld,
      1,
      COW_MAXIMUM_AGE_VALUE_DROPOFF,
      COW_MAXIMUM_VALUE_MULTIPLIER,
      COW_MINIMUM_VALUE_MULTIPLIER
    ),
    COW_MINIMUM_VALUE_MULTIPLIER,
    COW_MAXIMUM_VALUE_MULTIPLIER
  )

/**
 * @param {farmhand.recipe} recipe
 * @param {Array.<farmhand.item>} inventory
 * @returns {boolean}
 */
export const canMakeRecipe = ({ ingredients }, inventory) => {
  const inventoryQuantityMap = inventory.reduce((acc, { id, quantity }) => {
    acc[id] = quantity
    return acc
  }, {})

  return Object.keys(ingredients).every(
    itemId => inventoryQuantityMap[itemId] >= ingredients[itemId]
  )
}
