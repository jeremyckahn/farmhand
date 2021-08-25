import * as recipes from '../data/recipes'
import { cropType, recipeType } from '../enums'

import baseItemsMap from './items-map'

const {
  ASPARAGUS,
  CARROT,
  CORN,
  JALAPENO,
  ONION,
  PEA,
  POTATO,
  PUMPKIN,
  SOYBEAN,
  SPINACH,
  STRAWBERRY,
  TOMATO,
  WATERMELON,
  WHEAT,
} = cropType

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
  ...baseItemsMap,
  ...recipesMap,
}

export const cropIdToTypeMap = {
  [ASPARAGUS]: 'asparagus',
  [CARROT]: 'carrot',
  [CORN]: 'corn',
  [JALAPENO]: 'jalapeno',
  [ONION]: 'onion',
  [PEA]: 'pea',
  [POTATO]: 'potato',
  [PUMPKIN]: 'pumpkin',
  [SOYBEAN]: 'soybean',
  [SPINACH]: 'spinach',
  [STRAWBERRY]: 'strawberry',
  [TOMATO]: 'tomato',
  [WATERMELON]: 'watermelon',
  [WHEAT]: 'wheat',
}
