/** @typedef {import("../../index").farmhand.item} farmhand.item */

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

for (const recipeId of Object.keys(recipes.default)) {
  const recipe = recipes.default[recipeId]
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

export const cropTypeToIdMap = {
  SAMPLE_CROP_TYPE_1: 'sample-crop-type-1',
}

export const { cropItemIdToSeedItemMap, fermentableItemsMap } = {
  ...actualMaps,
}
