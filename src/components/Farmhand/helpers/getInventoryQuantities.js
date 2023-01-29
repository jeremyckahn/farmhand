import { itemsMap } from '../../../data/maps'

const itemIds = Object.keys(itemsMap)

/**
 * @param {Array.<{ playerId: farmhand.item, quantity: number }>} inventory
 * @returns {Object.<string, number>}
 */
export const getInventoryQuantities = inventory => {
  const quantities = {}

  for (const itemId of itemIds) {
    quantities[itemId] = 0
  }

  for (const { playerId, quantity } of inventory) {
    quantities[playerId] = quantity
  }

  return quantities
}
