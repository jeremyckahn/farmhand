/** @typedef {farmhand.keg} keg */

import { KEG_SPOILAGE_RATE_MULTIPLIER } from '../constants.js'
import { cellarService } from '../services/cellar.js'

/**
 * @param {keg} keg
 * @returns number
 */
export const getKegSpoilageRate = keg => {
  if (!cellarService.doesKegSpoil(keg) || keg.daysUntilMature > 0) {
    return 0
  }

  const spoilageRate =
    Math.abs(keg.daysUntilMature) * KEG_SPOILAGE_RATE_MULTIPLIER

  return spoilageRate
}
