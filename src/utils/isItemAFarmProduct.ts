import { itemType } from '../enums.js'

import { isItemAGrownCrop } from './isItemAGrownCrop.js'
import { isItemAGrownFruit } from './isItemAGrownFruit.js'

const FARM_PRODUCT_TYPES: itemType[] = [
  itemType.CRAFTED_ITEM,
  itemType.FUEL,
  itemType.MILK,
  itemType.ORE,
  itemType.STONE,
]

export const isItemAFarmProduct = (item: farmhand.item): boolean =>
  Boolean(
    isItemAGrownCrop(item) ||
      isItemAGrownFruit(item) ||
      FARM_PRODUCT_TYPES.includes(item.type)
  )
