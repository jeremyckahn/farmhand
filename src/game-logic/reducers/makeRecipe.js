import { canMakeRecipe } from '../../utils'

import { recipeType } from '../../enums'

import { EXPERIENCE_VALUES } from '../../constants'

import { addItemToInventory } from './addItemToInventory'
import { addExperience } from './addExperience'
import { decrementItemFromInventory } from './decrementItemFromInventory'

const EXPERIENCE_FOR_RECIPE = {
  [recipeType.FERMENTATION]: EXPERIENCE_VALUES.FERMENTATION_RECIPE_MADE,
  [recipeType.FORGE]: EXPERIENCE_VALUES.FORGE_RECIPE_MADE,
  [recipeType.KITCHEN]: EXPERIENCE_VALUES.KITCHEN_RECIPE_MADE,
  [recipeType.RECYCLING]: EXPERIENCE_VALUES.RECYCLING_RECIPE_MADE,
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.recipe} recipe
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const makeRecipe = (state, recipe, howMany = 1) => {
  if (!canMakeRecipe(recipe, state.inventory, howMany)) {
    return state
  }

  state = addExperience(state, EXPERIENCE_FOR_RECIPE[recipe.recipeType] || 0)

  state = Object.keys(recipe.ingredients).reduce(
    (state, ingredientId) =>
      decrementItemFromInventory(
        state,
        ingredientId,
        recipe.ingredients[ingredientId] * howMany
      ),
    state
  )

  return addItemToInventory(state, recipe, howMany)
}
