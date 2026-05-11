import { itemsMap } from '../data/maps.js'

import { getFinalCropItemFromSeedItem } from './index.js'

export function getCropsAvailableToFerment(
  levelEntitlements: farmhand.levelEntitlements
): farmhand.item[] {
  const cropsAvailableToFerment = Object.keys(levelEntitlements.items).reduce(
    (acc: farmhand.item[], itemId: string) => {
      const finalCropItemFromSeedItem = getFinalCropItemFromSeedItem(
        itemsMap[itemId]
      )

      if (
        finalCropItemFromSeedItem &&
        Number.isFinite(finalCropItemFromSeedItem.daysToFerment)
      ) {
        acc.push(finalCropItemFromSeedItem)
      }

      return acc
    },

    [] as Array<farmhand.item>
  )

  return cropsAvailableToFerment
}
