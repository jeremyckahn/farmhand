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

export const itemsMap = {
  ...baseItemsMap,
  ...kitchenRecipesMap,
  ...forgeRecipesMap,
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
