import { canMakeRecipe } from '../../utils'

import { addItemToInventory } from './addItemToInventory'
import { decrementItemFromInventory } from './decrementItemFromInventory'

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
