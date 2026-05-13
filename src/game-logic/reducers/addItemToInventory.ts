import { inventorySpaceRemaining } from '../../utils/index.js'

/**
 * Only adds as many items as there is room in the inventory for unless
 * allowInventoryOverage is true.
 */
export const addItemToInventory = (
  state: farmhand.state,
  item: farmhand.item,
  howMany: number = 1,
  allowInventoryOverage: boolean = false
): farmhand.state => {
  const { id } = item
  const inventory = [...state.inventory]

  const numberOfItemsToAdd = allowInventoryOverage
    ? howMany
    : Math.min(howMany, inventorySpaceRemaining(state))

  if (numberOfItemsToAdd === 0) {
    return state
  }

  const currentItemSlot = inventory.findIndex(({ id: itemId }) => id === itemId)

  if (~currentItemSlot) {
    const currentItem = inventory[currentItemSlot]

    inventory[currentItemSlot] = {
      ...currentItem,
      quantity: currentItem.quantity + numberOfItemsToAdd,
    }
  } else {
    inventory.push({ id, quantity: numberOfItemsToAdd })
  }

  return { ...state, inventory }
}
