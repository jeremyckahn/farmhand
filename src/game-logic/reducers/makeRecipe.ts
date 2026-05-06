import { recipeType } from '../../enums.js'
import { EXPERIENCE_VALUES } from '../../constants.js'

import { addItemToInventory } from './addItemToInventory.js'
import { consumeIngredients } from './consumeIngredients.js'

const EXPERIENCE_FOR_RECIPE = {
  [recipeType.FERMENTATION]: EXPERIENCE_VALUES.FERMENTATION_RECIPE_MADE,
  [recipeType.FORGE]: EXPERIENCE_VALUES.FORGE_RECIPE_MADE,
  [recipeType.KITCHEN]: EXPERIENCE_VALUES.KITCHEN_RECIPE_MADE,
  [recipeType.RECYCLING]: EXPERIENCE_VALUES.RECYCLING_RECIPE_MADE,
}

/**


 * @param [howMany=1]

 */
export const makeRecipe = (state: any, recipe: any, howMany?: number = 1): any => {
  const originalState = state
  state = consumeIngredients(
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
