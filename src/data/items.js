/**
 * @module farmhand.items
 */

import { fieldMode, itemType } from '../enums.js'
import {
  COW_FEED_ITEM_ID,
  HUGGING_MACHINE_ITEM_ID,
  INITIAL_SPRINKLER_RANGE,
} from '../constants.js'

const { freeze } = Object
const {
  COW_FEED,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  SCARECROW,
  SPRINKLER,
  WEED,
} = itemType

export {
  asparagus,
  asparagusSeed,
  carrot,
  carrotSeed,
  corn,
  cornSeed,
  garlic,
  garlicSeed,
  // Green grapes
  grapeChardonnay,
  grapeSauvignonBlanc,
  // grapePinotBlanc,
  // grapeMuscat,
  // grapeRiesling,
  // End green grapes
  // Purple grapes
  // grapeMerlot,
  grapeCabernetSauvignon,
  // grapeSyrah,
  grapeTempranillo,
  grapeNebbiolo,
  // End purple grapes
  grapeSeed,
  jalapeno,
  jalapenoSeed,
  olive,
  oliveSeed,
  onion,
  onionSeed,
  pea,
  peaSeed,
  potato,
  potatoSeed,
  pumpkin,
  pumpkinSeed,
  soybean,
  soybeanSeed,
  spinach,
  spinachSeed,
  sunflower,
  sunflowerSeed,
  strawberry,
  strawberrySeed,
  sweetPotato,
  sweetPotatoSeed,
  tomato,
  tomatoSeed,
  watermelon,
  watermelonSeed,
  wheat,
  wheatSeed,
} from './crops/index.js'

export const weed = freeze({
  id: 'weed',
  name: 'Weed',
  value: 0.1,
  doesPriceFluctuate: false,
  type: WEED,
})

export {
  bronzeOre,
  coal,
  goldOre,
  ironOre,
  silverOre,
  stone,
  saltRock,
} from './ores/index.js'

////////////////////////////////////////
//
// FIELD TOOLS
//
////////////////////////////////////////

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
  type: /** @type {farmhand.itemType} */ (FERTILIZER),
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
  type: /** @type {farmhand.itemType} */ (SPRINKLER),
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
  type: /** @type {farmhand.itemType} */ (SCARECROW),
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
  type: /** @type {farmhand.itemType} */ (COW_FEED),
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
  type: /** @type {farmhand.itemType} */ (HUGGING_MACHINE),
  value: 500,
})

/**
 * @property farmhand.module:items.milk1
 * @type {farmhand.item}
 */
export const milk1 = freeze({
  id: 'milk-1',
  name: 'Grade C Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 40,
})

/**
 * @property farmhand.module:items.milk2
 * @type {farmhand.item}
 */
export const milk2 = freeze({
  id: 'milk-2',
  name: 'Grade B Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 80,
})

/**
 * @property farmhand.module:items.milk3
 * @type {farmhand.item}
 */
export const milk3 = freeze({
  id: 'milk-3',
  name: 'Grade A Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 120,
})

/**
 * @property farmhand.module:items.rainbowMilk1
 * @type {farmhand.item}
 */
export const rainbowMilk1 = freeze({
  id: 'rainbow-milk-1',
  name: 'Grade C Rainbow Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 60,
})

/**
 * @property farmhand.module:items.rainbowMilk2
 * @type {farmhand.item}
 */
export const rainbowMilk2 = freeze({
  id: 'rainbow-milk-2',
  name: 'Grade B Rainbow Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 120,
})

/**
 * @property farmhand.module:items.rainbowMilk3
 * @type {farmhand.item}
 */
export const rainbowMilk3 = freeze({
  id: 'rainbow-milk-3',
  name: 'Grade A Rainbow Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 180,
})

/**
 * @property farmhand.module:items.chocolateMilk
 * @type {farmhand.item}
 */
export const chocolateMilk = freeze({
  id: 'chocolate-milk',
  name: 'Chocolate Milk',
  type: /** @type {farmhand.itemType} */ (MILK),
  value: 80,
})
