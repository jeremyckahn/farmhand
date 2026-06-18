import {
  dialogView,
  fertilizerType,
  fieldMode,
  stageFocusType,
  toolLevel,
  toolType,
} from '../enums.js'

export const testRecipe = (
  overrides: Partial<farmhand.recipe> = {}
): farmhand.recipe => ({
  id: 'sample-recipe-1',
  name: 'Test Recipe',
  description: 'A test recipe',
  ingredients: {
    'sample-item-1': 1,
  },
  condition: () => true,
  recipeType: 'KITCHEN',
  type: 'CRAFTED_ITEM',
  value: 100,
  ...overrides,
})
