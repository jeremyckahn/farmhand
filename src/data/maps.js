/** @typedef {import("../index").farmhand.item} farmhand.item */

import { cropType, recipeType } from '../enums'

import * as recipes from './recipes'
import upgrades from './upgrades'

import baseItemsMap from './items-map'

import { grapeSeed } from './crops'

const {
  ASPARAGUS,
  CARROT,
  CORN,
  GARLIC,
  GRAPE,
  JALAPENO,
  OLIVE,
  ONION,
  PEA,
  POTATO,
  PUMPKIN,
  SOYBEAN,
  SPINACH,
  SUNFLOWER,
  STRAWBERRY,
  SWEET_POTATO,
  TOMATO,
  WATERMELON,
  WHEAT,
  WEED,
} = cropType

export const recipeCategories = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
  [recipeType.FERMENTATION]: {},
  [recipeType.RECYCLING]: {},
  [recipeType.WINE]: {},
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

/**
 * @type {Object.<string, farmhand.item>}
 */
export const itemsMap = {
  ...baseItemsMap,
  ...recipesMap,
  ...upgradesMap,
}

/**
 * @type {Object.<string, farmhand.item>}
 */
export const fermentableItemsMap = Object.fromEntries(
  Object.entries(itemsMap).filter(([itemId]) => {
    const item = itemsMap[itemId]

    return 'daysToFerment' in item
  })
)

/**
 * @type {Object.<string, farmhand.item>}
 */
export const cropItemIdToSeedItemMap = Object.entries(baseItemsMap).reduce(
  (acc, [itemId, item]) => {
    const { growsInto } = item
    if (growsInto) {
      const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

      for (const variantId of variants) {
        acc[variantId] = baseItemsMap[itemId]
      }
    }

    return acc
  },
  {}
)

/**
 * @type {Object.<string, string|Array.<string>>}
 */
export const cropTypeToIdMap = {
  [ASPARAGUS]: 'asparagus',
  [CARROT]: 'carrot',
  [CORN]: 'corn',
  [GARLIC]: 'garlic',
  [GRAPE]: grapeSeed.growsInto,
  [JALAPENO]: 'jalapeno',
  [OLIVE]: 'olive',
  [ONION]: 'onion',
  [PEA]: 'pea',
  [POTATO]: 'potato',
  [PUMPKIN]: 'pumpkin',
  [SOYBEAN]: 'soybean',
  [SPINACH]: 'spinach',
  [STRAWBERRY]: 'strawberry',
  [SUNFLOWER]: 'sunflower',
  [SWEET_POTATO]: 'sweet-potato',
  [TOMATO]: 'tomato',
  [WATERMELON]: 'watermelon',
  [WHEAT]: 'wheat',
  [WEED]: 'weed',
}
