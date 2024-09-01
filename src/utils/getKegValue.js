/** @typedef {import("../index").farmhand.keg} keg */

import {
  KEG_INTEREST_RATE,
  WINE_GROWTH_TIMELINE_CAP,
  WINE_INTEREST_RATE,
} from '../constants.js'
import { itemsMap } from '../data/maps.js'
import { wineService } from '../services/wine.js'

import { getItemBaseValue } from './getItemBaseValue.js'

/**
 * @param {keg} keg
 */
export const getKegValue = keg => {
  const { itemId, daysUntilMature } = keg
  const kegItem = itemsMap[itemId]

  if (daysUntilMature > 0) return 0

  let principalValue = 0
  let interestRate = 0
  let exponent = 0

  if (wineService.isWineRecipe(kegItem)) {
    principalValue = kegItem.value
    interestRate = WINE_INTEREST_RATE
    exponent = Math.min(Math.max(-daysUntilMature, 1), WINE_GROWTH_TIMELINE_CAP)
  } else {
    principalValue = (kegItem.tier ?? 1) * getItemBaseValue(itemId)
    interestRate = KEG_INTEREST_RATE
    exponent = Math.abs(keg.daysUntilMature)
  }

  // NOTE: Keg values are (loosely) based on the standard compound interest
  // rate formula:
  //
  //   A = P(1 + r/n)^nt
  //
  // A = final amount
  // P = initial principal balance
  // r = interest rate
  // n = number of times interest applied per time period
  // t = number of time periods elapsed
  const kegValue = principalValue * (1 + interestRate) ** exponent

  return kegValue
}
