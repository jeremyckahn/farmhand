import { recipeType } from '../enums.js'
import { maxYieldOfRecipe } from '../utils/maxYieldOfRecipe.js'

export class VinegarService {
  isVinegarRecipe = (recipe: any): recipe is farmhand.vinegar => {
    return 'recipeType' in recipe && recipe.recipeType === recipeType.VINEGAR
  }

  getMaxVinegarYield = ({
    recipe,
    inventory,
    cellarInventory,
    cellarSize,
  }: {
    recipe: farmhand.vinegar
    inventory: farmhand.state['inventory']
    cellarInventory: farmhand.keg[]
    cellarSize: number
  }): number => {
    const availableCellarSpace = cellarSize - cellarInventory.length
    const ingredientConstraint = maxYieldOfRecipe(recipe, inventory)

    return Math.max(0, Math.min(availableCellarSpace, ingredientConstraint))
  }
}

export const vinegarService = new VinegarService()
