import { recipeType } from '../../enums'

import * as items from './items'
import * as recipes from './recipes'

export const recipeCategories = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
  [recipeType.RECYCLING]: {},
}

export const recipesMap = {}

for (const recipeId of Object.keys(recipes)) {
  const recipe = recipes[recipeId]
  recipeCategories[recipe.recipeType][recipe.playerId] = recipe
  recipesMap[recipe.playerId] = recipe
}

export const itemsMap = {
  ...Object.keys(items).reduce((acc, itemName) => {
    const item = items[itemName]
    acc[item.playerId] = item
    return acc
  }, {}),
  ...recipesMap,
}

export const cropIdToTypeMap = {
  SAMPLE_CROP_TYPE_1: 'sample-crop-type-1',
}
