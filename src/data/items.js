/**
 * @module farmhand.items
 */

import { cropLifeStage, cropType, fieldMode, itemType } from '../enums'
import {
  COW_FEED_ITEM_ID,
  HUGGING_MACHINE_ITEM_ID,
  INITIAL_SPRINKLER_RANGE,
} from '../constants'

const { freeze } = Object
const {
  ASPARAGUS,
  CARROT,
  CORN,
  JALAPENO,
  ONION,
  POTATO,
  PUMPKIN,
  SOYBEAN,
  SPINACH,
  TOMATO,
  WHEAT,
} = cropType
const { SEED, GROWING } = cropLifeStage
const {
  COW_FEED,
  CROP,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  SCARECROW,
  SPRINKLER,
} = itemType

////////////////////////////////////////
//
// CROPS
//
////////////////////////////////////////

const crop = ({
  cropTimetable,
  growsInto,
  tier,

  isSeed = Boolean(growsInto),
  cropLifecycleDuration = Object.values(cropTimetable).reduce(
    (acc, value) => acc + value,
    0
  ),

  ...rest
}) =>
  freeze({
    cropTimetable,
    doesPriceFluctuate: true,
    tier,
    type: CROP,
    value: 10 + cropLifecycleDuration * tier * (isSeed ? 1 : 3),
    ...(isSeed && {
      enablesFieldMode: fieldMode.PLANT,
      growsInto,
      isPlantableCrop: true,
    }),
    ...rest,
  })

const fromSeed = ({ cropTimetable, cropType, growsInto, tier }) => ({
  cropTimetable,
  cropType,
  doesPriceFluctuate: true,
  id: growsInto,
  tier,
  type: CROP,
})

/**
 * @property farmhand.module:items.carrotSeed
 * @type {farmhand.item}
 */
export const carrotSeed = crop({
  cropType: CARROT,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
  growsInto: 'carrot',
  id: 'carrot-seed',
  name: 'Carrot Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.carrot
 * @type {farmhand.item}
 */
export const carrot = crop({
  ...fromSeed(carrotSeed),
  name: 'Carrot',
})

/**
 * @property farmhand.module:items.asparagusSeed
 * @type {farmhand.item}
 */
export const asparagusSeed = crop({
  cropType: ASPARAGUS,
  cropTimetable: {
    [SEED]: 4,
    [GROWING]: 5,
  },
  growsInto: 'asparagus',
  id: 'asparagus-seed',
  name: 'Asparagus Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.asparagus
 * @type {farmhand.item}
 */
export const asparagus = crop({
  ...fromSeed(asparagusSeed),
  name: 'Asparagus',
})

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = crop({
  cropType: PUMPKIN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 5,
  },
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  name: 'Pumpkin Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const pumpkin = crop({
  ...fromSeed(pumpkinSeed),
  name: 'Pumpkin',
})

/**
 * @property farmhand.module:items.spinachSeed
 * @type {farmhand.item}
 */
export const spinachSeed = crop({
  cropType: SPINACH,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 4,
  },
  growsInto: 'spinach',
  id: 'spinach-seed',
  name: 'Spinach Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.spinach
 * @type {farmhand.item}
 */
export const spinach = crop({
  ...fromSeed(spinachSeed),
  name: 'Spinach',
})

/**
 * @property farmhand.module:items.cornSeed
 * @type {farmhand.item}
 */
export const cornSeed = crop({
  cropType: CORN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 7,
  },
  growsInto: 'corn',
  id: 'corn-seed',
  name: 'Corn Kernels',
  tier: 2,
})

/**
 * @property farmhand.module:items.corn
 * @type {farmhand.item}
 */
export const corn = crop({
  ...fromSeed(cornSeed),
  name: 'Corn',
})

/**
 * @property farmhand.module:items.potatoSeed
 * @type {farmhand.item}
 */
export const potatoSeed = crop({
  cropType: POTATO,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
  growsInto: 'potato',
  id: 'potato-seed',
  name: 'Potato Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.potato
 * @type {farmhand.item}
 */
export const potato = crop({
  ...fromSeed(potatoSeed),
  name: 'Potato',
})

/**
 * @property farmhand.module:items.onionSeed
 * @type {farmhand.item}
 */
export const onionSeed = crop({
  cropType: ONION,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 4,
  },
  growsInto: 'onion',
  id: 'onion-seed',
  name: 'Onion Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.onion
 * @type {farmhand.item}
 */
export const onion = crop({
  ...fromSeed(onionSeed),
  name: 'Onion',
})

/**
 * @property farmhand.module:items.soybeanSeed
 * @type {farmhand.item}
 */
export const soybeanSeed = crop({
  cropType: SOYBEAN,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 2,
  },
  growsInto: 'soybean',
  id: 'soybean-seed',
  name: 'Soybean Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.soybean
 * @type {farmhand.item}
 */
export const soybean = crop({
  ...fromSeed(soybeanSeed),
  name: 'Soybean',
})

/**
 * @property farmhand.module:items.wheatSeed
 * @type {farmhand.item}
 */
export const wheatSeed = crop({
  cropType: WHEAT,
  cropTimetable: {
    [SEED]: 1,
    [GROWING]: 1,
  },
  growsInto: 'wheat',
  id: 'wheat-seed',
  name: 'Wheat Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.wheat
 * @type {farmhand.item}
 */
export const wheat = crop({
  ...fromSeed(wheatSeed),
  name: 'Wheat',
})

/**
 * @property farmhand.module:items.tomatoSeed
 * @type {farmhand.item}
 */
export const tomatoSeed = crop({
  cropType: TOMATO,
  cropTimetable: {
    [SEED]: 5,
    [GROWING]: 6,
  },
  growsInto: 'tomato',
  id: 'tomato-seed',
  name: 'Tomato Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.tomato
 * @type {farmhand.item}
 */
export const tomato = crop({
  ...fromSeed(tomatoSeed),
  name: 'Tomato',
})

/**
 * @property farmhand.module:items.jalapenoSeed
 * @type {farmhand.item}
 */
export const jalapenoSeed = crop({
  cropType: JALAPENO,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
  growsInto: 'jalapeno',
  id: 'jalapeno-seed',
  name: 'Jalapeño Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.carrot
 * @type {farmhand.item}
 */
export const jalapeno = crop({
  ...fromSeed(jalapenoSeed),
  name: 'Jalapeño',
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
  id: 'fertilizer',
  name: 'Fertilizer',
  type: FERTILIZER,
  value: 25,
})

/**
 * @property farmhand.module:items.rainbowFertilizer
 * @type {farmhand.item}
 */
export const rainbowFertilizer = freeze({
  description:
    'Helps crops grow a little faster and automatically replants them upon harvesting. Consumes seeds upon replanting and disappears if none are available. Also works for Scarecrows.',
  enablesFieldMode: fieldMode.FERTILIZE,
  id: 'rainbow-fertilizer',
  name: 'Rainbow Fertilizer',
  type: FERTILIZER,
  // Rainbow Fertilizer is worth less than regular Fertilizer because it is not
  // sold in the shop. Items that are sold in the shop have automatically
  // reduced resale value, but since that would not apply to Rainbow
  // Fertilizer, it is pre-reduced via this hardcoded value.
  value: 15,
})

/**
 * @property farmhand.module:items.sprinkler
 * @type {farmhand.item}
 */
export const sprinkler = freeze({
  description: 'Automatically waters adjacent plants every day.',
  enablesFieldMode: fieldMode.SET_SPRINKLER,
  // Note: The actual hoveredPlotRangeSize of sprinklers grows with the
  // player's level.
  hoveredPlotRangeSize: INITIAL_SPRINKLER_RANGE,
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
  // Note: This needs to be a safe number (rather than Infinity) because it
  // potentially gets JSON.stringify-ed during data export. Non-safe numbers
  // get stringify-ed to "null", which breaks reimporting.
  hoveredPlotRangeSize: Number.MAX_SAFE_INTEGER,
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
 * @property farmhand.module:items.huggingMachine
 * @type {farmhand.item}
 */
export const huggingMachine = freeze({
  id: HUGGING_MACHINE_ITEM_ID,
  description: 'Automatically hugs one cow three times every day.',
  name: 'Hugging Machine',
  type: HUGGING_MACHINE,
  value: 500,
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

/**
 * @property farmhand.module:items.rainbowMilk1
 * @type {farmhand.item}
 */
export const rainbowMilk1 = freeze({
  id: 'rainbow-milk-1',
  name: 'Grade C Rainbow Milk',
  type: MILK,
  value: 60,
})

/**
 * @property farmhand.module:items.rainbowMilk2
 * @type {farmhand.item}
 */
export const rainbowMilk2 = freeze({
  id: 'rainbow-milk-2',
  name: 'Grade B Rainbow Milk',
  type: MILK,
  value: 120,
})

/**
 * @property farmhand.module:items.rainbowMilk3
 * @type {farmhand.item}
 */
export const rainbowMilk3 = freeze({
  id: 'rainbow-milk-3',
  name: 'Grade A Rainbow Milk',
  type: MILK,
  value: 180,
})

/**
 * @property farmhand.module:items.chocolateMilk
 * @type {farmhand.item}
 */
export const chocolateMilk = freeze({
  id: 'chocolate-milk',
  name: 'Chocolate Milk',
  type: MILK,
  value: 80,
})
