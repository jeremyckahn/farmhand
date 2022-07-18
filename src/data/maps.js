import { cropType, recipeType } from '../enums'

import * as recipes from './recipes'
import upgrades from './upgrades'

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
  WEED,
} = cropType

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

export const upgradesMap = {}

for (let toolType of Object.keys(upgrades)) {
  for (let upgrade of Object.values(upgrades[toolType])) {
    upgradesMap[upgrade.id] = upgrade
  }
}

export const itemsMap = {
  ...baseItemsMap,
  ...recipesMap,
  ...upgradesMap,
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
  [WEED]: 'weed',
}
