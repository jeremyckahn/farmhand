import { recipeType } from '../../enums'

import * as items from './items'
import * as recipes from './recipes'

export const kitchenRecipesMap = []
export const forgeRecipesMap = []

for (const recipeId of Object.keys(recipes)) {
  const recipe = recipes[recipeId]

  switch (recipe.recipeType) {
    case recipeType.KITCHEN:
      kitchenRecipesMap[recipe.id] = recipe
      break

    case recipeType.FORGE:
      forgeRecipesMap[recipe.id] = recipe
      break

    default:
      throw new Error(`Received invalid recipe ID: ${recipe.id}`)
  }
}

export const recipesMap = {
  ...kitchenRecipesMap,
  ...forgeRecipesMap,
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
