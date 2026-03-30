/**
 * @typedef {farmhand.item} item
 * @typedef {farmhand.recipe} recipe
 * @typedef {farmhand.wine} wine
 * @typedef {farmhand.grape} grape
 * @typedef {farmhand.grapeVariety} grapeVarietyEnum
 * @typedef {farmhand.keg} keg
 */

import { GRAPES_REQUIRED_FOR_WINE } from '../constants.ts'
import { wineVarietyValueMap } from '../data/crops/grape.ts'
import { itemsMap } from '../data/maps.ts'
import { recipeType } from '../enums.ts'
import { getInventoryQuantityMap } from '../utils/getInventoryQuantityMap.ts'
import { getYeastRequiredForWine } from '../utils/getYeastRequiredForWine.ts'

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
      // @ts-expect-error
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
