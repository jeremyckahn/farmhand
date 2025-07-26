/**
 * @typedef {farmhand.levelEntitlements} levelEntitlements
 * @typedef {farmhand.item} item
 */
import { itemsMap } from '../data/maps.js'

import { getFinalCropItemFromSeedItem } from './index.js'

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

      if (finalCropItemFromSeedItem) {
        acc.push(finalCropItemFromSeedItem)
      }

      return acc
    },

    []
  )

  return cropsAvailableToFerment
}
