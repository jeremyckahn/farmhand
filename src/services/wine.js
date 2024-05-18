/**
 * @typedef {import('../').farmhand.item} item
 * @typedef {import('../').farmhand.recipe} recipe
 * @typedef {import('../').farmhand.wine} wine
 * @typedef {import('../enums').grapeVariety} grapeVarietyEnum
 * @typedef {import('../').farmhand.keg} keg
 */

import { wineVarietyValueMap } from '../data/crops/grape'
import { itemsMap } from '../data/maps'
import { recipeType } from '../enums'
import { getInventoryQuantityMap } from '../utils/getInventoryQuantityMap'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine'

export class WineService {
  /**
   * @private
   */
  maturityDayMultiplier = 3

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getDaysToMature = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.maturityDayMultiplier
  }

  /**
   * @param {item} recipe
   * @returns {recipe is wine}
   */
  isWineRecipe = recipe => {
    return 'recipeType' in recipe && recipe.recipeType === recipeType.WINE
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
      yeastQuantityInInventory / getYeastRequiredForWine(grapeVariety)
    )

    const maxYield = Math.min(
      cellarSize - cellarInventory.length,
      grapeQuantityInInventory,
      maxWineYieldPotential
    )

    return maxYield
  }
}

export const wineService = new WineService()
