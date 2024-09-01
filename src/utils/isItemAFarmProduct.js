/** @typedef {import('../index').farmhand.item} farmhand.item */
import { itemType } from '../enums.js'

import { isItemAGrownCrop } from './isItemAGrownCrop.js'

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
  Boolean(isItemAGrownCrop(item) || FARM_PRODUCT_TYPES.includes(item.type))
