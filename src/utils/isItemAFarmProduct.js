import { itemType } from '../enums'

import { isItemAGrownCrop } from './isItemAGrownCrop'

const FARM_PRODUCT_TYPES = [itemType.MILK, itemType.CRAFTED_ITEM]

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAFarmProduct = item =>
  Boolean(isItemAGrownCrop(item) || FARM_PRODUCT_TYPES.includes(item.type))
