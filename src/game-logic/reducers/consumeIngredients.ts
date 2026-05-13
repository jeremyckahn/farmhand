import { canMakeRecipe } from '../../utils/index.js'

import { addExperience } from './addExperience.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * Consume ingredients - validate, add experience, and decrement ingredients
 * @param recipe Recipe or upgrade object with ingredients
 * @param recipeYield How many units of the recipe to consume ingredients for
 * @param experiencePoints Experience points to award
 * @returns
 */

export const consumeIngredients = (
  state: farmhand.state,
  recipe: { ingredients: Record<string, number> },
  recipeYield: number = 1,
  experiencePoints: number = 0
): farmhand.state => {
  if (
    recipe.ingredients &&
    !canMakeRecipe(recipe as farmhand.recipe, state.inventory, recipeYield)
  ) {
    return state
  }

  state = addExperience(state, experiencePoints)

  return Object.keys(recipe.ingredients || {}).reduce(
    (reducerState, ingredientId) =>
      decrementItemFromInventory(
        reducerState,
        ingredientId,
        recipe.ingredients[ingredientId] * recipeYield
      ),
    state
  )
}
