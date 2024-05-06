/**
 * @typedef {import("..").farmhand.item} item
 * @typedef {import("..").farmhand.keg} keg
 */

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
}

export const cellarService = new CellarService()
