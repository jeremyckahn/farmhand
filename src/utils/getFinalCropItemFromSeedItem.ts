import { itemsMap } from '../data/maps.js'

import { getFinalCropItemIdFromSeedItemId } from './getFinalCropItemIdFromSeedItemId.js'

export const getFinalCropItemFromSeedItem = (
  { id }: { id: string },
  variantIdx: number = 0
): farmhand.item | undefined => {
  const itemId = getFinalCropItemIdFromSeedItemId(id, variantIdx)

  if (itemId) return itemsMap[itemId]
}
