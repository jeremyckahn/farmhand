import { recipeType } from '../../enums.js'
import { EXPERIENCE_VALUES } from '../../constants.js'

import { addItemToInventory } from './addItemToInventory.js'
import { consumeIngredients } from './consumeIngredients.js'

const EXPERIENCE_FOR_RECIPE: Partial<Record<farmhand.recipeType, number>> = {
  [recipeType.FERMENTATION]: EXPERIENCE_VALUES.FERMENTATION_RECIPE_MADE,
  [recipeType.FORGE]: EXPERIENCE_VALUES.FORGE_RECIPE_MADE,
  [recipeType.KITCHEN]: EXPERIENCE_VALUES.KITCHEN_RECIPE_MADE,
  [recipeType.RECYCLING]: EXPERIENCE_VALUES.RECYCLING_RECIPE_MADE,
  [recipeType.WOOD_CHIPPER]: EXPERIENCE_VALUES.WOOD_CHIPPER_RECIPE_MADE,
}

export const makeRecipe = (
  state: farmhand.state,
  recipe: farmhand.recipe,
  howMany: number = 1
): farmhand.state => {
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

  state = {
    ...state,
    recipesMade: {
      ...state.recipesMade,
      [recipe.id]: (state.recipesMade[recipe.id] || 0) + howMany,
    },
  }

  return addItemToInventory(state, recipe, howMany)
}
