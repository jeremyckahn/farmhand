import { itemsMap } from '../data/maps.js'

/**
 * @param itemId
 * @returns {number}
 */
export const getItemBaseValue = itemId => itemsMap[itemId].value
