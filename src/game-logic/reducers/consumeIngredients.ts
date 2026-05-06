import { canMakeRecipe } from '../../utils/index.js'

import { addExperience } from './addExperience.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * Consume ingredients - validate, add experience, and decrement ingredients

 * @param recipe - Recipe or upgrade object with ingredients
 * @param [recipeYield=1] - How many units of the recipe to consume ingredients for
 * @param [experiencePoints=0] - Experience points to award

 */

export const consumeIngredients = (
  state: any,
  recipe: object,
  recipeYield?: number = 1,
  experiencePoints?: number = 0
): any => {
  if (
    recipe.ingredients &&
    !canMakeRecipe(recipe, state.inventory, recipeYield)
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
