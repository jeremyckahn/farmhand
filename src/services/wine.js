/**
 * @typedef {import('../').farmhand.item} item
 * @typedef {import('../').farmhand.recipe} recipe
 * @typedef {import('../').farmhand.wine} wine
 * @typedef {import('../enums').grapeVariety} grapeVarietyEnum
 */

import { wineVarietyValueMap } from '../data/crops/grape'
import { recipeType } from '../enums'

export class WineService {
  /**
   * @private
   */
  maturityDayMultiplier = 3

  /**
   * @private
   */
  yeastRequirementMultiplier = 5

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getDaysToMature = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.maturityDayMultiplier
  }

  /**
   * @param {grapeVarietyEnum} grapeVariety
   */
  getYeastRequiredForWine = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.yeastRequirementMultiplier
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
