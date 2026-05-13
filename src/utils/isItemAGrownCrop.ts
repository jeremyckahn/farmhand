import { itemType } from '../enums.js'

export const isItemAGrownCrop = (item: farmhand.item): boolean =>
  Boolean(item.type === itemType.CROP && !item.growsInto)
