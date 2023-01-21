/** @typedef {import("../../index").farmhand.item} farmhand.item */

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

/**
 * @type {Object.<string, farmhand.item>}
 */
export const cropItemIdToSeedItemMap = Object.entries(itemsMap).reduce(
  (acc, [itemId, item]) => {
    const { growsInto } = item
    if (growsInto) {
      const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

      for (const variantId of variants) {
        acc[variantId] = itemsMap[itemId]
      }
    }

    return acc
  },
  {}
)

export const cropTypeToIdMap = {
  SAMPLE_CROP_TYPE_1: 'sample-crop-type-1',
}
