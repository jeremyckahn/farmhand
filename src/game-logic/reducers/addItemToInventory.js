import { inventorySpaceRemaining } from '../../utils'

/**
 * Only adds as many items as there is room in the inventory for unless
 * allowInventoryOverage is true.
 * @param {farmhand.state} state
 * @param {farmhand.item} item
 * @param {number} [howMany=1]
 * @param {boolean} [allowInventoryOverage=false]
 * @returns {farmhand.state}
 */
export const addItemToInventory = (
  state,
  item,
  howMany = 1,
  allowInventoryOverage = false
) => {
  const { playerId } = item
  const inventory = [...state.inventory]

  const numberOfItemsToAdd = allowInventoryOverage
    ? howMany
    : Math.min(howMany, inventorySpaceRemaining(state))

  if (numberOfItemsToAdd === 0) {
    return state
  }

  const currentItemSlot = inventory.findIndex(({ playerId: itemId }) => playerId === itemId)

  if (~currentItemSlot) {
    const currentItem = inventory[currentItemSlot]

    inventory[currentItemSlot] = {
      ...currentItem,
      quantity: currentItem.quantity + numberOfItemsToAdd,
    }
  } else {
    inventory.push({ playerId, quantity: numberOfItemsToAdd })
  }

  return { ...state, inventory }
}
