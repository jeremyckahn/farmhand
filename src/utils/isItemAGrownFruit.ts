import { itemType } from '../enums.js'

export const isItemAGrownFruit = (item: farmhand.item): boolean =>
  Boolean(item.type === itemType.TREE && !item.isPlantableTree)
