import { canMakeRecipe } from '../../utils/index.js'

import { addExperience } from './addExperience.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

/**
 * Process ingredients - validate, add experience, and decrement ingredients
 * @param {farmhand.state} state
 * @param {object} recipe - Recipe or upgrade object with ingredients
 * @param {number} [howMany=1]
 * @param {number} [experiencePoints=0] - Experience points to award
 * @returns {farmhand.state}
 */

export const processIngredients = (
  state,
  recipe,
  howMany = 1,
  experiencePoints = 0
) => {
  // Skip validation if there are no ingredients
  if (recipe.ingredients && !canMakeRecipe(recipe, state.inventory, howMany)) {
    return state
  }

  state = addExperience(state, experiencePoints)

  return Object.keys(recipe.ingredients || {}).reduce(
    (state, ingredientId) =>
      decrementItemFromInventory(
        state,
        ingredientId,
        recipe.ingredients[ingredientId] * howMany
      ),
    state
  )
}
