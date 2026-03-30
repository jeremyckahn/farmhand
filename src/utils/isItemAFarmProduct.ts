import { itemType } from '../enums.ts'

import { isItemAGrownCrop } from './isItemAGrownCrop.ts'

const FARM_PRODUCT_TYPES = [
  itemType.CRAFTED_ITEM,
  itemType.FUEL,
  itemType.MILK,
  itemType.ORE,
  itemType.STONE,
]

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAFarmProduct = item =>
  Boolean(
    isItemAGrownCrop(item) ||
      FARM_PRODUCT_TYPES.includes(/** @type {any} */ item.type)
  )
