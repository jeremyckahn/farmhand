/**
 * @typedef {import("..").farmhand.item} item
 * @typedef {import("..").farmhand.keg} keg
 */

import { v4 as uuid } from 'uuid'

import { fermentableItemsMap, itemsMap } from '../data/maps'
import { memoize } from '../utils/memoize'
import { getInventoryQuantityMap } from '../utils/getInventoryQuantityMap'
// eslint-disable-next-line no-unused-vars
import { grapeVariety as grapeVarietyEnum } from '../enums'

import { wineService } from './wine'

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

  // FIXME: Test this
  /**
   * @param {item} grape
   * @param {{ id: string, quantity: number }[]} inventory
   * @param {Array.<keg>} cellarInventory
   * @param {number} cellarSize
   * @param {grapeVarietyEnum} grapeVariety
   * @returns {number}
   */
  getMaxWineYield = (
    grape,
    inventory,
    cellarInventory,
    cellarSize,
    grapeVariety
  ) => {
    const {
      [grape.id]: grapeQuantityInInventory = 0,
      [itemsMap.yeast.id]: yeastQuantityInInventory = 0,
    } = getInventoryQuantityMap(inventory)

    const maxWineYieldPotential = Math.floor(
      yeastQuantityInInventory /
        wineService.getYeastRequiredForWine(grapeVariety)
    )

    const maxYield = Math.min(
      cellarSize - cellarInventory.length,
      grapeQuantityInInventory,
      maxWineYieldPotential
    )

    return maxYield
  }
}

export const cellarService = new CellarService()