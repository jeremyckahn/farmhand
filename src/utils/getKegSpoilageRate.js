/** @typedef {import("../index").farmhand.keg} keg */

/**
 * @param {keg} keg
 * @returns number
 */
export const getKeySpoilageRate = keg => {
  if (keg.daysUntilMature > 0) {
    return 0
  }

  // FIXME: Determine keg spoilage rate here

  return 0
}
