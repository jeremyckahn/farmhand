/**
 * @module farmhand.enums
 */

/**
 * @param {Array.<string>} keys
 * @returns {Object.<string>}
 */
const enumify = keys => keys.reduce((acc, key) => ({ [key]: key, ...acc }), {});

/**
 * @property farmhand.module:enums.cropType
 * @enum {string}
 */
export const cropType = enumify(['CARROT', 'PUMPKIN']);

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
]);

/**
 * @property farmhand.module:enums.stageFocusType
 * @enum {string}
 */
export const stageFocusType = enumify(['NONE', 'FIELD', 'SHOP', 'INVENTORY']);

/**
 * @property farmhand.module:enums.cropLifeStage
 * @enum {string}
 */
export const cropLifeStage = enumify(['SEED', 'GROWING', 'GROWN']);

/**
 * @property farmhand.module:enums.plotContentType
 * @enum {string}
 */
export const plotContentType = enumify(['CROP', 'SPRINKLER', 'SCARECROW']);
