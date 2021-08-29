import { recipeType } from '../../enums'

import * as items from './items'
import * as recipes from './recipes'

export const recipeCategories = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
}

export const recipesMap = {}

for (const recipeId of Object.keys(recipes)) {
  const recipe = recipes[recipeId]
  recipeCategories[recipe.recipeType][recipe.id] = recipe
  recipesMap[recipe.id] = recipe
}

export const itemsMap = {
  ...Object.keys(items).reduce((acc, itemName) => {
    const item = items[itemName]
    acc[item.id] = item
    return acc
  }, {}),
  ...recipesMap,
}

export const cropIdToTypeMap = {
  SAMPLE_CROP_TYPE_1: 'sample-crop-type-1',
}
