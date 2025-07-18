import { canMakeRecipe } from '../../utils/index.js'

import { addExperience } from './addExperience.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * Consume ingredients - validate, add experience, and decrement ingredients
 * @param {farmhand.state} state
 * @param {object} recipe - Recipe or upgrade object with ingredients
 * @param {number} [recipeYield=1] - How many units of the recipe to consume ingredients for
 * @param {number} [experiencePoints=0] - Experience points to award
 * @returns {farmhand.state}
 */

export const consumeIngredients = (
  state,
  recipe,
  recipeYield = 1,
  experiencePoints = 0
) => {
  if (
    recipe.ingredients &&
    !canMakeRecipe(recipe, state.inventory, recipeYield)
  ) {
    return state
  }

  state = addExperience(state, experiencePoints)

  return Object.keys(recipe.ingredients || {}).reduce(
    (state, ingredientId) =>
      decrementItemFromInventory(
        state,
        ingredientId,
        recipe.ingredients[ingredientId] * recipeYield
      ),
    state
  )
}
