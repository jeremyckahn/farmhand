/**
 * @typedef {import('../').farmhand.item} item
 * @typedef {import('../').farmhand.recipe} recipe
 * @typedef {import('../').farmhand.wine} wine
 * @typedef {import('../').farmhand.grape} grape
 * @typedef {import('../enums').grapeVariety} grapeVarietyEnum
 * @typedef {import('../').farmhand.keg} keg
 */

import { GRAPES_REQUIRED_FOR_WINE } from '../constants'
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

  /**
   * @param {grape} grape
   * @param {{ id: string, quantity: number }[]} inventory
   * @param {keg[]} cellarInventory
   * @param {number} cellarSize
   */
  getMaxWineYield = (grape, inventory, cellarInventory, cellarSize) => {
    const {
      [grape.id]: grapeQuantityInInventory = 0,
      [itemsMap.yeast.id]: yeastQuantityInInventory = 0,
    } = getInventoryQuantityMap(inventory)

    const availableCellarSpace = cellarSize - cellarInventory.length

    const grapeQuantityConstraint = Math.floor(
      grapeQuantityInInventory / GRAPES_REQUIRED_FOR_WINE
    )

    const yeastQuantityConstraint = Math.floor(
      yeastQuantityInInventory / getYeastRequiredForWine(grape.variety)
    )

    const maxYield = Math.min(
      availableCellarSpace,
      grapeQuantityConstraint,
      yeastQuantityConstraint
    )

    return maxYield
  }
}

export const wineService = new WineService()
