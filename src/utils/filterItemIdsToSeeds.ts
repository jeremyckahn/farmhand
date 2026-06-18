import { itemsMap } from '../data/maps.js'
import { itemType } from '../enums.js'

export const filterItemIdsToSeeds = (itemsIds: string[]): string[] =>
  itemsIds.filter(id => itemsMap[id]?.type === itemType.CROP)
