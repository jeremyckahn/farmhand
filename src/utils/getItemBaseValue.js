import { itemsMap } from '../data/maps'

/**
 * @param {string} itemId
 * @returns {number}
 */
export const getItemBaseValue = itemId => itemsMap[itemId].value
