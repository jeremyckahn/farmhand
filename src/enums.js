/**
 * @module farmhand.enums
 * @ignore
 */

/**
 * @param {Array.<string>} keys
 * @returns {Object.<string>}
 */
export const enumify = keys =>
  keys.reduce((acc, key) => ({ [key]: key, ...acc }), {})

/**
 * @property farmhand.module:enums.cropType
 * @enum {string}
 */
export const cropType = enumify([
  'ASPARAGUS',
  'CARROT',
  'CORN',
  'JALAPENO',
  'ONION',
  'PEA',
  'POTATO',
  'PUMPKIN',
  'SOYBEAN',
  'SPINACH',
  'STRAWBERRY',
  'TOMATO',
  'WATERMELON',
  'WHEAT',
])

/**
 * @property farmhand.module:enums.fieldMode
 * @enum {string}
 */
export const fieldMode = enumify([
  'CLEANUP',
  'FERTILIZE',
  'HARVEST',
  'MINE',
  'OBSERVE',
  'PLANT',
  'SET_SPRINKLER',
  'SET_SCARECROW',
  'WATER',
])

/**
 * @property farmhand.module:enums.stageFocusType
 * @enum {string}
 */
export const stageFocusType = enumify([
  'NONE', // Used for testing
  'HOME',
  'FIELD',
  'SHOP',
  'COW_PEN',
  'INVENTORY',
  'WORKSHOP',
])

/**
 * @property farmhand.module:enums.cropLifeStage
 * @enum {string}
 */
export const cropLifeStage = enumify(['SEED', 'GROWING', 'GROWN'])

/**
 * @property farmhand.module:enums.itemType
 * @enum {string}
 */
export const itemType = enumify([
  'BRONZE_ORE',
  'COW_FEED',
  'CRAFTED_ITEM',
  'CROP',
  'FERTILIZER',
  'HUGGING_MACHINE',
  'MILK',
  'SCARECROW',
  'SILVER_ORE',
  'SPRINKLER',
  'STONE',
])

/**
 * @property farmhand.module:enums.fertilizerType
 * @enum {string}
 */
export const fertilizerType = enumify(['NONE', 'STANDARD', 'RAINBOW'])

/**
 * @property farmhand.module:enums.genders
 * @enum {string}
 */
export const genders = enumify(['FEMALE', 'MALE'])

/**
 * @property farmhand.module:enums.cowColors
 * @enum {string}
 */
export const cowColors = enumify([
  'BLUE',
  'BROWN',
  'GREEN',
  'ORANGE',
  'PURPLE',
  'RAINBOW',
  'WHITE',
  'YELLOW',
])

const { RAINBOW, ...standardCowColors } = cowColors
export { standardCowColors }

/**
 * @property farmhand.module:enums.dialogView
 * @enum {string}
 */
export const dialogView = enumify([
  'NONE',
  'ACCOUNTING',
  'ACHIEVEMENTS',
  'FARMERS_LOG',
  'ONLINE_PEERS',
  'PRICE_EVENTS',
  'SETTINGS',
  'STATS',
])
