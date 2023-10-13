/** @typedef {import('../index').farmhand.item} farmhand.item */
import { itemType } from '../enums'

import { isItemAGrownCrop } from './isItemAGrownCrop'

const FARM_PRODUCT_TYPES = [
  itemType.CRAFTED_ITEM,
  itemType.FUEL,
  itemType.MILK,
  itemType.ORE,
]

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAFarmProduct = item =>
  Boolean(isItemAGrownCrop(item) || FARM_PRODUCT_TYPES.includes(item.type))
