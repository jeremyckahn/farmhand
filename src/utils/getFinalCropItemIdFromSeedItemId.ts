import { itemsMap } from '../data/maps.js'

export const getFinalCropItemIdFromSeedItemId = (
  seedItemId: string,
  variationIdx: number = 0
): string | undefined => {
  const { growsInto } = itemsMap[seedItemId]

  if (Array.isArray(growsInto)) {
    return growsInto[variationIdx]
  } else {
    return growsInto
  }
}
