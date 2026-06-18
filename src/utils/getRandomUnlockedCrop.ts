import { itemsMap } from '../data/maps.js'

import { chooseRandom } from './chooseRandom.js'
import { chooseRandomIndex } from './chooseRandomIndex.js'
import { getFinalCropItemIdFromSeedItemId } from './getFinalCropItemIdFromSeedItemId.js'

export const getRandomUnlockedCrop = (
  unlockedSeedItemIds: Array<string>
): farmhand.item => {
  const seedItemId = chooseRandom(unlockedSeedItemIds)
  const seedItem = itemsMap[seedItemId]
  const variationIdx = Array.isArray(seedItem.growsInto)
    ? chooseRandomIndex(seedItem.growsInto)
    : 0

  const finalCropItemId = getFinalCropItemIdFromSeedItemId(
    seedItemId,
    variationIdx
  )

  if (!finalCropItemId)
    throw new Error(
      `Seed item ID ${seedItemId} has no corresponding final crop ID`
    )

  return itemsMap[finalCropItemId]
}
