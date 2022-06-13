import { itemsMap } from '../../../data/maps'

const itemIds = Object.keys(itemsMap)

/**
 * @param {Array.<{ id: farmhand.item, quantity: number }>} inventory
 * @returns {Object.<string, number>}
 */
export const getPlayerInventoryQuantities = inventory => {
  return itemIds.reduce((acc, itemId) => {
    const itemInInventory = inventory.find(({ id }) => id === itemId)
    acc[itemId] = itemInInventory ? itemInInventory.quantity : 0

    return acc
  }, {})
}
