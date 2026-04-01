/**
 * @typedef {farmhand.levelEntitlements} levelEntitlements
 * @typedef {farmhand.item} item
 */
import { itemsMap } from '../data/maps.ts'

import { getFinalCropItemFromSeedItem } from './index.tsx'

/**
 * @param {levelEntitlements} levelEntitlements
 * @returns {item[]}
 */
export function getCropsAvailableToFerment(levelEntitlements) {
  const cropsAvailableToFerment = Object.keys(levelEntitlements.items).reduce(
    /**
     * @param {farmhand.item[]} acc
     * @param {string} itemId
     */
    (acc, itemId) => {
      const finalCropItemFromSeedItem = getFinalCropItemFromSeedItem(
        itemsMap[itemId]
      )

      if (
        finalCropItemFromSeedItem &&
        Number.isFinite(finalCropItemFromSeedItem.daysToFerment)
      ) {
        // @ts-expect-error
        acc.push(finalCropItemFromSeedItem)
      }

      return acc
    },

    []
  )

  return cropsAvailableToFerment
}
