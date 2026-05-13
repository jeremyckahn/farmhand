import { itemsMap } from '../../../data/maps.js'

const itemIds = Object.keys(itemsMap)

export const getInventoryQuantities = inventory => {
  const quantities: Record<string, number> = {}

  for (const itemId of itemIds) {
    quantities[itemId] = 0
  }

  for (const { id, quantity } of inventory) {
    quantities[id] = quantity
  }

  return quantities
}
