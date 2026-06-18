import { maxYieldOfRecipe } from './maxYieldOfRecipe.js'

export const canMakeRecipe = (
  recipe: farmhand.recipe,
  inventory: Array<{ id: string; quantity: number }>,
  howMany: number
): boolean => maxYieldOfRecipe(recipe, inventory) >= howMany
