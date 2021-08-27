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
