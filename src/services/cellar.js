/**
 * @typedef {import("..").farmhand.item} item
 * @typedef {import("..").farmhand.keg} keg
 */

import { v4 as uuid } from 'uuid'

import { fermentableItemsMap, itemsMap } from '../data/maps.js'
import { memoize } from '../utils/memoize.js'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine.js'

import { PURCHASEABLE_CELLARS } from '../constants.js'

import { wineService } from './wine.js'

export class CellarService {
  /**
   * @private
   */
  _uuid = uuid

  getItemInstancesInCellar = memoize(
    /**
     * @param {keg[]} cellarInventory
     * @param {item} item
     */
    (cellarInventory, item) => {
      return cellarInventory.filter(keg => keg.itemId === item.id).length
    },
    { cacheSize: Object.keys(fermentableItemsMap).length }
  )

  /**
   * @param {item} item
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
   * @param {keg[]} cellarInventory
   * @param {number} purchasedCellar
   */
  doesCellarSpaceRemain = (cellarInventory, purchasedCellar) => {
    return (
      cellarInventory.length <
      (PURCHASEABLE_CELLARS.get(purchasedCellar)?.space ?? 0)
    )
  }

  /**
   * @param {keg} keg
   */
  doesKegSpoil = keg => {
    const item = itemsMap[keg.itemId]
    const doesKegSpoil = !wineService.isWineRecipe(item)

    return doesKegSpoil
  }
}

export const cellarService = new CellarService()
