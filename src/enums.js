/**
 * @module farmhand.enums
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
export const cropType = enumify(['CARROT', 'PUMPKIN'])

/**
 * @property farmhand.module:enums.fieldMode
 * @enum {string}
 */
export const fieldMode = enumify([
  'CLEANUP',
  'FERTILIZE',
  'HARVEST',
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
  'NONE', // Useed for testing
  'HOME',
  'FIELD',
  'SHOP',
  'COW_PEN',
  'KITCHEN',
  'INVENTORY',
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
  'COW_FEED',
  'CROP',
  'DISH',
  'FERTILIZER',
  'MILK',
  'SCARECROW',
  'SPRINKLER',
])

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
  'WHITE',
  'YELLOW',
])

/**
 * @property farmhand.module:enums.dialogView
 * @enum {string}
 */
export const dialogView = enumify(['NONE', 'FARMERS_LOG'])
