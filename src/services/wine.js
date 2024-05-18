/**
 * @typedef {import('../').farmhand.item} item
 * @typedef {import('../').farmhand.recipe} recipe
 * @typedef {import('../').farmhand.wine} wine
 * @typedef {import('../enums').grapeVariety} grapeVarietyEnum
 * @typedef {import('../').farmhand.keg} keg
 */

import { WINE_INTEREST_RATE, WINE_GROWTH_TIMELINE_CAP } from '../constants'
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

  // FIXME: Test this
  // FIXME: Roll this into getKegValue
  /**
   * @param {keg} wineKeg
   * @returns {number}
   */
  getWineValue = wineKeg => {
    const kegRecipe = itemsMap[wineKeg.itemId]

    if (!this.isWineRecipe(kegRecipe)) {
      throw new Error(`getWineValue received a non-wine keg recipe`)
    }

    const { daysUntilMature } = wineKeg

    const multiplier = Math.min(
      Math.max(-daysUntilMature, 1),
      WINE_GROWTH_TIMELINE_CAP
    )

    const principalValue = kegRecipe.value

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
    const value = principalValue * (1 + WINE_INTEREST_RATE) ** multiplier

    return value
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
