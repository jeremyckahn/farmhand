import { inventorySpaceRemaining } from '../../utils/index.js'

/**
 * Only adds as many items as there is room in the inventory for unless
 * allowInventoryOverage is true.


 * @param [howMany=1]
 * @param [allowInventoryOverage=false]

 */
export const addItemToInventory = (
  state: any,
  item: any,
  howMany?: number = 1,
  allowInventoryOverage?: boolean = false
): any => {
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
