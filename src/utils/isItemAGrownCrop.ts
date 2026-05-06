import { itemType } from '../enums.js'


export const isItemAGrownCrop = item =>
  Boolean(item.type === itemType.CROP && !item.growsInto)
