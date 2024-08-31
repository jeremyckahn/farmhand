/**
 * @typedef {import('../index').farmhand.levelEntitlements} levelEntitlements
 * @typedef {import('../index').farmhand.item} item
 */
import { itemsMap } from '../data/maps.js'

import { getFinalCropItemFromSeedItem } from './index.js'

/**
 * @param {levelEntitlements} levelEntitlements
 * @returns {item[]}
 */
export function getCropsAvailableToFerment(levelEntitlements) {
  const cropsAvailableToFerment = Object.keys(levelEntitlements.items)
    .map(itemId => getFinalCropItemFromSeedItem(itemsMap[itemId]))
    .filter(item => (item ? 'daysToFerment' in item : false))

  return cropsAvailableToFerment
}
