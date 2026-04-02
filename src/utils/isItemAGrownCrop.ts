import { itemType } from '../enums.ts'

/**
 * @param {farmhand.item} item
 * @returns {boolean}
 */
export const isItemAGrownCrop = item =>
  Boolean(item.type === itemType.CROP && !item.growsInto)
