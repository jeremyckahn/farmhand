import { canMakeRecipe } from '../../utils/index.js'
import { recipeType } from '../../enums.js'
import { EXPERIENCE_VALUES } from '../../constants.js'

import { addItemToInventory } from './addItemToInventory.js'
import { addExperience } from './addExperience.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

const EXPERIENCE_FOR_RECIPE = {
  [recipeType.FERMENTATION]: EXPERIENCE_VALUES.FERMENTATION_RECIPE_MADE,
  [recipeType.FORGE]: EXPERIENCE_VALUES.FORGE_RECIPE_MADE,
  [recipeType.KITCHEN]: EXPERIENCE_VALUES.KITCHEN_RECIPE_MADE,
  [recipeType.RECYCLING]: EXPERIENCE_VALUES.RECYCLING_RECIPE_MADE,
}

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

/**
 * @param {farmhand.state} state
 * @param {farmhand.recipe} recipe
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const makeRecipe = (state, recipe, howMany = 1) => {
  const originalState = state
  state = processIngredients(
    state,
    recipe,
    howMany,
    EXPERIENCE_FOR_RECIPE[recipe.recipeType] || 0
  )

  // Only add to inventory if ingredient processing was successful
  if (state === originalState) {
    return state
  }

  return addItemToInventory(state, recipe, howMany)
}
