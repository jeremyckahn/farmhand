import { itemType } from '../enums'

import { isItemAGrownCrop } from './isItemAGrownCrop'

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAFarmProduct = item =>
  Boolean(
    isItemAGrownCrop(item) ||
      item.type === itemType.MILK ||
      item.type === itemType.CRAFTED_ITEM
  )
