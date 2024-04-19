import { itemsMap } from '../../../data/maps'

const itemIds = Object.keys(itemsMap)

/**
 * @param {Array.<{ id: farmhand.item, quantity: number }>} inventory
 * @returns {Record<string, number>}
 */
export const getInventoryQuantities = inventory => {
  const quantities = {}

  for (const itemId of itemIds) {
    quantities[itemId] = 0
  }

  for (const { id, quantity } of inventory) {
    quantities[id] = quantity
  }

  return quantities
}
