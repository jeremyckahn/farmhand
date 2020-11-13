import * as recipes from '../data/recipes'
import { cropType } from '../enums'

import baseItemsMap from './items-map'

const {
  CARROT,
  CORN,
  ONION,
  POTATO,
  PUMPKIN,
  SOYBEAN,
  SPINACH,
  TOMATO,
  WHEAT,
} = cropType

export const recipesMap = Object.keys(recipes).reduce((acc, recipeName) => {
  const recipe = recipes[recipeName]
  acc[recipe.id] = recipe
  return acc
}, {})

export const itemsMap = {
  ...baseItemsMap,
  ...recipesMap,
}

export const cropIdToTypeMap = {
  [CARROT]: 'carrot',
  [CORN]: 'corn',
  [ONION]: 'onion',
  [POTATO]: 'potato',
  [PUMPKIN]: 'pumpkin',
  [SOYBEAN]: 'soybean',
  [SPINACH]: 'spinach',
  [TOMATO]: 'tomato',
  [WHEAT]: 'wheat',
}
