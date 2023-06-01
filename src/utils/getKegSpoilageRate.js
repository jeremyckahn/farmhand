/** @typedef {import("../index").farmhand.keg} keg */

import { KEG_SPOILAGE_RATE_MULTIPLIER } from '../constants'

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
