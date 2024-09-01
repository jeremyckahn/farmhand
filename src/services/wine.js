/**
 * @typedef {import('../').farmhand.item} item
 * @typedef {import('../').farmhand.recipe} recipe
 * @typedef {import('../').farmhand.wine} wine
 * @typedef {import('../').farmhand.grape} grape
 * @typedef {import('../enums.js').grapeVariety} grapeVarietyEnum
 * @typedef {import('../').farmhand.keg} keg
 */

import { GRAPES_REQUIRED_FOR_WINE } from '../constants.js'
import { wineVarietyValueMap } from '../data/crops/grape.js'
import { itemsMap } from '../data/maps.js'
import { recipeType } from '../enums.js'
import { getInventoryQuantityMap } from '../utils/getInventoryQuantityMap.js'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine.js'

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
   * @param {Object} props
   * @param {grape} props.grape
   * @param {{ id: string, quantity: number }[]} props.inventory
   * @param {keg[]} props.cellarInventory
   * @param {number} props.cellarSize
   */
  getMaxWineYield = ({ grape, inventory, cellarInventory, cellarSize }) => {
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
