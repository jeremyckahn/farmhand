/**
 * @param {farmhand.state} state
 * @param {string} itemId
 * @param {number} [howMany=1]
 * @returns {farmhand.state}
 */
export const decrementItemFromInventory = (state, itemId, howMany = 1) => {
  const inventory = [...state.inventory]
  const itemInventoryIndex = inventory.findIndex(({ id }) => id === itemId)

  if (itemInventoryIndex === -1) {
    return state
  }

  const { quantity } = inventory[itemInventoryIndex]

  if (quantity > howMany) {
    inventory[itemInventoryIndex] = {
      ...inventory[itemInventoryIndex],
      quantity: quantity - howMany,
    }
  } else {
    inventory.splice(itemInventoryIndex, 1)
  }

  return { ...state, inventory }
}
