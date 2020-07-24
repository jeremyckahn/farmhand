/**
 * @module farmhand.items
 */

import { cropLifeStage, cropType, fieldMode, itemType } from '../enums'
import {
  COW_FEED_ITEM_ID,
  FERTILIZER_ITEM_ID,
  SPRINKLER_RANGE,
} from '../constants'

const { freeze } = Object
const { CARROT, CORN, PUMPKIN, SPINACH } = cropType
const { SEED, GROWING } = cropLifeStage
const { COW_FEED, CROP, FERTILIZER, MILK, SCARECROW, SPRINKLER } = itemType

////////////////////////////////////////
//
// CROPS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.carrotSeed
 * @type {farmhand.item}
 */
export const carrotSeed = freeze({
  cropType: CARROT,
  doesPriceFluctuate: true,
  enablesFieldMode: fieldMode.PLANT,
  growsInto: 'carrot',
  id: 'carrot-seed',
  isPlantableCrop: true,
  name: 'Carrot Seed',
  type: CROP,
  value: 20,
})

/**
 * @property farmhand.module:items.carrot
 * @type {farmhand.item}
 */
export const carrot = freeze({
  cropType: CARROT,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
  doesPriceFluctuate: true,
  id: 'carrot',
  name: 'Carrot',
  type: CROP,
  value: 40,
})

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = freeze({
  cropType: PUMPKIN,
  doesPriceFluctuate: true,
  enablesFieldMode: fieldMode.PLANT,
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  isPlantableCrop: true,
  name: 'Pumpkin Seed',
  type: CROP,
  value: 40,
})

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const pumpkin = freeze({
  cropType: PUMPKIN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 5,
  },
  doesPriceFluctuate: true,
  id: 'pumpkin',
  name: 'Pumpkin',
  type: CROP,
  value: 80,
})

/**
 * @property farmhand.module:items.spinachSeed
 * @type {farmhand.item}
 */
export const spinachSeed = freeze({
  cropType: SPINACH,
  doesPriceFluctuate: true,
  enablesFieldMode: fieldMode.PLANT,
  growsInto: 'spinach',
  id: 'spinach-seed',
  isPlantableCrop: true,
  name: 'Spinach Seed',
  type: CROP,
  value: 30,
})

/**
 * @property farmhand.module:items.spinach
 * @type {farmhand.item}
 */
export const spinach = freeze({
  cropType: SPINACH,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 4,
  },
  doesPriceFluctuate: true,
  id: 'spinach',
  name: 'Spinach',
  type: CROP,
  value: 50,
})

/**
 * @property farmhand.module:items.cornSeed
 * @type {farmhand.item}
 */
export const cornSeed = freeze({
  cropType: CORN,
  doesPriceFluctuate: true,
  enablesFieldMode: fieldMode.PLANT,
  growsInto: 'corn',
  id: 'corn-seed',
  isPlantableCrop: true,
  name: 'Corn Kernels',
  type: CROP,
  value: 50,
})

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const corn = freeze({
  cropType: CORN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 7,
  },
  doesPriceFluctuate: true,
  id: 'corn',
  name: 'Corn',
  type: CROP,
  value: 120,
})

////////////////////////////////////////
//
// FIELD TOOLS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.fertilizer
 * @type {farmhand.item}
 */
export const fertilizer = freeze({
  description: 'Helps crops grow and mature a little faster.',
  enablesFieldMode: fieldMode.FERTILIZE,
  id: FERTILIZER_ITEM_ID,
  name: 'Fertilizer',
  type: FERTILIZER,
  value: 60,
})

/**
 * @property farmhand.module:items.sprinkler
 * @type {farmhand.item}
 */
export const sprinkler = freeze({
  description: 'Automatically waters adjacent plants every day.',
  enablesFieldMode: fieldMode.SET_SPRINKLER,
  hoveredPlotRangeSize: SPRINKLER_RANGE,
  id: 'sprinkler',
  isReplantable: true,
  name: 'Sprinkler',
  type: SPRINKLER,
  value: 120,
})

/**
 * @property farmhand.module:items.scarecrow
 * @type {farmhand.item}
 */
export const scarecrow = freeze({
  description:
    'Prevents crows from eating your crops. One scarecrow covers an entire field, but they are afraid of storms.',
  enablesFieldMode: fieldMode.SET_SCARECROW,
  id: 'scarecrow',
  isReplantable: true,
  name: 'Scarecrow',
  type: SCARECROW,
  value: 160,
})

////////////////////////////////////////
//
// COW ITEMS
//
////////////////////////////////////////

/**
 * @property farmhand.module:items.cowFeed
 * @type {farmhand.item}
 */
export const cowFeed = freeze({
  id: COW_FEED_ITEM_ID,
  description:
    'Each cow automatically consumes one unit of Cow Feed per day. Fed cows gain and maintain weight.',
  name: 'Cow Feed',
  type: COW_FEED,
  value: 5,
})

/**
 * @property farmhand.module:items.milk1
 * @type {farmhand.item}
 */
export const milk1 = freeze({
  id: 'milk-1',
  name: 'Grade C Milk',
  type: MILK,
  value: 40,
})

/**
 * @property farmhand.module:items.milk2
 * @type {farmhand.item}
 */
export const milk2 = freeze({
  id: 'milk-2',
  name: 'Grade B Milk',
  type: MILK,
  value: 80,
})

/**
 * @property farmhand.module:items.milk3
 * @type {farmhand.item}
 */
export const milk3 = freeze({
  id: 'milk-3',
  name: 'Grade A Milk',
  type: MILK,
  value: 120,
})
