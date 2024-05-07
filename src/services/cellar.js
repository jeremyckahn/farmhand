/**
 * @typedef {import("..").farmhand.item} item
 * @typedef {import("..").farmhand.keg} keg
 */

import { v4 as uuid } from 'uuid'

import { fermentableItemsMap } from '../data/maps'
import { memoize } from '../utils/memoize'

export class CellarService {
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
    return {
      id: uuid(),
      itemId: item.id,
      daysUntilMature: item.daysToFerment ?? 0,
    }
  }
}

export const cellarService = new CellarService()
