import { itemsMap } from '../../../data/maps.js'

const itemIds = Object.keys(itemsMap)

/**
 * @param {Array.<{ id: farmhand.item['id'], quantity: number }>} inventory
 */
export const getInventoryQuantities = inventory => {
  /** @type {Record<string, number>} */
  const quantities = {}

  for (const itemId of itemIds) {
    quantities[itemId] = 0
  }

  for (const { id, quantity } of inventory) {
    quantities[id] = quantity
  }

  return quantities
}
