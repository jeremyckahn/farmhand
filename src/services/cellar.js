/**
 * @typedef {import("..").farmhand.item} item
 * @typedef {import("..").farmhand.keg} keg
 */

import { v4 as uuid } from 'uuid'

import { fermentableItemsMap } from '../data/maps'
import { memoize } from '../utils/memoize'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine'

import { PURCHASEABLE_CELLARS } from '../constants'

import { wineService } from './wine'

export class CellarService {
  /**
   * @private
   */
  _uuid

  constructor(uuidFactory = uuid) {
    this._uuid = uuidFactory
  }

  getItemInstancesInCellar = memoize(
    /**
     * @param {keg[]} cellarInventory
     * @param {item} item
     * @returns number
     */
    (cellarInventory, item) => {
      return cellarInventory.filter(keg => keg.itemId === item.id).length
    },
    { cacheSize: Object.keys(fermentableItemsMap).length }
  )

  /**
   * @param {item} item
   * @returns {keg}
   */
  generateKeg = item => {
    /** @type {keg} */
    const keg = {
      id: this._uuid(),
      itemId: item.id,
      daysUntilMature: item.daysToFerment ?? 0,
    }

    if (wineService.isWineRecipe(item)) {
      keg.daysUntilMature = getYeastRequiredForWine(item.variety)
    }

    return keg
  }

  /**
   * @param {Array.<keg>} cellarInventory
   * @param {number} purchasedCellar
   * @returns {boolean}
   */
  doesCellarSpaceRemain = (cellarInventory, purchasedCellar) => {
    return (
      cellarInventory.length <
      (PURCHASEABLE_CELLARS.get(purchasedCellar)?.space ?? 0)
    )
  }
}

export const cellarService = new CellarService()
