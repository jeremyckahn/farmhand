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
  /**
   * @param {keg} wineKeg
   * @returns {number}
   */
  getWineValue = wineKeg => {
    const kegRecipe = itemsMap[wineKeg.itemId]

    if (!this.isWineRecipe(kegRecipe)) {
      throw new Error(`getWineValue received a non-wine keg recipe`)
    }

    const grapeVariety = kegRecipe.variety
    const wineVarietyValue = wineVarietyValueMap[grapeVariety]

    const { daysUntilMature } = wineKeg

    const multiplier = Math.min(daysUntilMature, 100)
    const value = kegRecipe.value + (multiplier + wineVarietyValue) ** 2.5

    return value
  }

  /**
   * @param {item} recipe
   * @returns {recipe is wine}
   */
  isWineRecipe = recipe => {
    return 'recipeType' in recipe && recipe.recipeType === recipeType.WINE
  }
}

export const wineService = new WineService()
