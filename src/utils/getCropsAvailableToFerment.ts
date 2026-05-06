/**
 * @typedef {farmhand.levelEntitlements} levelEntitlements
 * @typedef {farmhand.item} item
 */
import { itemsMap } from '../data/maps.js'

import { getFinalCropItemFromSeedItem } from './index.js'


export function getCropsAvailableToFerment(levelEntitlements: levelEntitlements): item[] {
  const cropsAvailableToFerment = Object.keys(levelEntitlements.items).reduce(

    (acc, itemId) => {
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
