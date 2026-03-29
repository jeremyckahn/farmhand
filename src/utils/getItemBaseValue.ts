import { itemsMap } from '../data/maps.js'

/**
 * @param {string} itemId
 * @returns {number}
 */
export const getItemBaseValue = itemId => itemsMap[itemId].value
