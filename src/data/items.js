/**
 * @module farmhand.items
 */

import { fieldMode, itemType } from '../enums'
import {
  COW_FEED_ITEM_ID,
  HUGGING_MACHINE_ITEM_ID,
  INITIAL_SPRINKLER_RANGE,
} from '../constants'

const { freeze } = Object
const {
  COW_FEED,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  MINED,
  SCARECROW,
  SPRINKLER,
} = itemType

export {
  asparagus,
  asparagusSeed,
  carrot,
  carrotSeed,
  corn,
  cornSeed,
  jalapeno,
  jalapenoSeed,
  onion,
  onionSeed,
  potato,
  potatoSeed,
  pumpkin,
  pumpkinSeed,
  soybean,
  soybeanSeed,
  spinach,
  spinachSeed,
  tomato,
  tomatoSeed,
  wheat,
  wheatSeed,
} from './crops'

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

// TODO: move this, name it something better.
export const mined = freeze({
  description: 'a plot that has been mined. will be restored tomorrow',
  hoveredPlotRangeSize: 1,
  id: 'mined',
  isReplantable: false,
  name: 'Rubble',
  type: MINED,
  value: 0,
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
