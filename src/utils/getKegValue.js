/** @typedef {import("../index").farmhand.keg} keg */

import { KEG_INTEREST_RATE } from '../constants'
import { itemsMap } from '../data/maps'

import { getItemBaseValue } from './getItemBaseValue'

/**
 * @param {keg} keg
 */
export const getKegValue = keg => {
  const { itemId } = keg
  const kegItem = itemsMap[itemId]
  const principalValue = (kegItem.tier ?? 1) * getItemBaseValue(itemId)

  // NOTE: This is (loosely) based on the standard compound interest rate
  // formula:
  //
  //   A = P(1 + r/n)^nt
  //
  // A = final amount
  // P = initial principal balance
  // r = interest rate
  // n = number of times interest applied per time period
  // t = number of time periods elapsed
  const kegValue =
    principalValue * (1 + KEG_INTEREST_RATE) ** Math.abs(keg.daysUntilMature)

  return kegValue
}
