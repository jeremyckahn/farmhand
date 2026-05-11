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

  getDaysToMature = grapeVariety => {
    return wineVarietyValueMap[grapeVariety] * this.maturityDayMultiplier
  }

  isWineRecipe = (recipe: any): recipe is farmhand.wine => {
    return 'recipeType' in recipe && recipe.recipeType === recipeType.WINE
  }

  getMaxWineYield = ({ grape, inventory, cellarInventory, cellarSize }) => {
    const {
      [grape.id]: grapeQuantityInInventory = 0,
      [itemsMap['yeast']?.id ?? '']: yeastQuantityInInventory = 0,
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
