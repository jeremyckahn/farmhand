import { cropType, recipeType } from '../enums.js'

import * as recipes from './recipes.js'
import upgrades from './upgrades.js'

import baseItemsMap from './items-map.js'

import { grapeSeed } from './crops/index.js'

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

export const recipeCategories: Record<
  string,
  Record<string, farmhand.recipe>
> = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
  [recipeType.FERMENTATION]: {},
  [recipeType.RECYCLING]: {},
  [recipeType.WINE]: {},
}

export const recipesMap: Record<string, farmhand.recipe> = {}

for (const recipeId of Object.keys(recipes)) {
  const recipe = ((recipes as unknown) as Record<string, farmhand.recipe>)[
    recipeId
  ]
  recipeCategories[recipe.recipeType][recipe.id] = recipe
  recipesMap[recipe.id] = recipe
}

export const upgradesMap: Record<string, farmhand.upgradesMetadatum> = {}

for (let toolType of Object.keys(upgrades)) {
  for (let upgrade of Object.values(
    ((upgrades as unknown) as Record<
      string,
      Record<string, farmhand.upgradesMetadatum>
    >)[toolType]
  )) {
    upgradesMap[upgrade.id] = upgrade
  }
}

export const itemsMap: Record<string, farmhand.item> = {
  ...baseItemsMap,
  ...recipesMap,
  ...upgradesMap,
}

export const fermentableItemsMap: Record<
  string,
  farmhand.item
> = Object.fromEntries(
  Object.entries(itemsMap).filter(([itemId]) => {
    const item = itemsMap[itemId]

    return 'daysToFerment' in item
  })
)

export const cropItemIdToSeedItemMap: Record<
  string,
  farmhand.seedItem
> = Object.entries(baseItemsMap).reduce((acc, [itemId, item]) => {
  const { growsInto } = item as { growsInto?: string | string[] }
  if (growsInto) {
    const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

    for (const variantId of variants) {
      acc[variantId] = baseItemsMap[itemId]
    }
  }

  return acc
}, {})

export const cropTypeToIdMap: Record<string, string | Array<string>> = {
  [ASPARAGUS]: 'asparagus',
  [CARROT]: 'carrot',
  [CORN]: 'corn',
  [GARLIC]: 'garlic',
  [GRAPE]: grapeSeed.growsInto as string | string[],
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
