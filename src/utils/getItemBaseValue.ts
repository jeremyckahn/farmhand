import { itemsMap } from '../data/maps.ts'

/**
 * @param {string} itemId
 * @returns {number}
 */
export const getItemBaseValue = itemId => itemsMap[itemId].value
