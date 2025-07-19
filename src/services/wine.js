/**
 * @typedef {farmhand.item} item
 * @typedef {farmhand.recipe} recipe
 * @typedef {farmhand.wine} wine
 * @typedef {farmhand.grape} grape
 * @typedef {farmhand.grapeVariety} grapeVarietyEnum
 * @typedef {farmhand.keg} keg
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
