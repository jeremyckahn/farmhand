import { recipeType } from '../../enums'

import * as items from './items'
import * as recipes from './recipes'

export const kitchenRecipesMap = Object.keys(recipes).reduce(
  (acc, recipeName) => {
    const recipe = recipes[recipeName]
    if (recipe.recipeType === recipeType.KITCHEN) acc[recipe.id] = recipe
    return acc
  },
  {}
)

export const forgeRecipesMap = Object.keys(recipes).reduce(
  (acc, recipeName) => {
    const recipe = recipes[recipeName]
    if (recipe.recipeType === recipeType.FORGE) acc[recipe.id] = recipe
    return acc
  },
  {}
)

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
