import { itemsMap } from '../data/maps.js'

export const getAdjustedItemValue = (
  valueAdjustments: Record<string, number>,
  itemId: string
): number =>
  Number(((valueAdjustments[itemId] || 1) * itemsMap[itemId].value).toFixed(2))
