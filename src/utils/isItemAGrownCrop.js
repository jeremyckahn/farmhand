import { itemType } from '../enums'

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAGrownCrop = item =>
  Boolean(item.type === itemType.CROP && !item.growsInto)
