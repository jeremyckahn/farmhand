/** @typedef {import("../index").farmhand.keg} keg */

import { PURCHASEABLE_CELLARS } from '../constants'

// FIXME: Move to cellarService
/**
 * @param {Array.<keg>} cellarInventory
 * @param {number} purchasedCellar
 * @returns {boolean}
 */
export const doesCellarSpaceRemain = (cellarInventory, purchasedCellar) => {
  return (
    cellarInventory.length < PURCHASEABLE_CELLARS.get(purchasedCellar).space
  )
}
