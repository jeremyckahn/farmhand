import { itemType } from '../enums.js'

/**
 * @param item
 * @returns {boolean}
 */
export const isItemAGrownCrop = item =>
  Boolean(item.type === itemType.CROP && !item.growsInto)
