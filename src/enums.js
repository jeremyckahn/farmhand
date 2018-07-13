/**
 * @module farmhand.enums
 */

/**
 * @param {Array.<string>} keys
 * @returns {Object.<string>}
 */
const enumify = keys =>
  keys.reduce((acc, key) => Object.assign(acc, { [key]: key }), {});

/**
 * @property farmhand.module:enums.cropType
 * @enum {string}
 */
export const cropType = enumify(['CARROT']);
