import { recipeType } from '../../enums.js'
import * as actualMaps from '../maps.js'

import * as items from './items.js'
import * as recipes from './recipes.js'

export const recipeCategories = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
  [recipeType.RECYCLING]: {},
  [recipeType.WINE]: {},
}

export const recipesMap = {}

for (const recipeId of Object.keys(recipes)) {
  const recipe = recipes[recipeId]
  // Only process objects that have recipe properties
  if (recipe && typeof recipe === 'object' && recipe.recipeType && recipe.id) {
    recipeCategories[recipe.recipeType][recipe.id] = recipe
    recipesMap[recipe.id] = recipe
  }
}

export const itemsMap = {
  ...Object.keys(items).reduce((acc, itemName) => {
    const item = items[itemName]
    acc[item.id] = item
    return acc
  }, {}),
  ...recipesMap,
  // Ensure sample-recipe-1 is available for tests
  'sample-recipe-1': recipes.sampleRecipe1,
}

export const cropTypeToIdMap = {
  SAMPLE_CROP_TYPE_1: 'sample-crop-type-1',
}

export const { cropItemIdToSeedItemMap, fermentableItemsMap } = {
  ...actualMaps,
}
