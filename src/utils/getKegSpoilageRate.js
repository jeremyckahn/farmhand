/** @typedef {import("../index").farmhand.keg} keg */

const KEG_SPOILAGE_RATE_MULTIPLIER = 0.001

/**
 * @param {keg} keg
 * @returns number
 */
export const getKegSpoilageRate = keg => {
  if (keg.daysUntilMature > 0) {
    return 0
  }

  const spoilageRate =
    Math.abs(keg.daysUntilMature) * KEG_SPOILAGE_RATE_MULTIPLIER

  return spoilageRate
}
