import { recipeCategories } from '../data/maps.js'
import { recipeType } from '../enums.js'

export function getVinegarRecipesAvailableToMake(
  itemsSold: farmhand.state['itemsSold']
): farmhand.vinegar[] {
  const vinegarRecipes = Object.values(
    recipeCategories[recipeType.VINEGAR]
  ) as farmhand.vinegar[]

  return vinegarRecipes.filter(
    recipe => (itemsSold[recipe.unlockItemId] || 0) > 0
  )
}
