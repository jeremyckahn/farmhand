import { inventorySpaceRemaining } from '../../utils'

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

// TODO: Change showNotification to accept a configuration object instead of so
// many formal parameters.
/**
 * @param {farmhand.state} state
 * @param {string} message
 * @param {string} [severity] Corresponds to the `severity` prop here:
 * https://material-ui.com/api/alert/
 * @returns {farmhand.state}
 * @see https://material-ui.com/api/alert/
 */
export const showNotification = (
  state,
  message,
  severity = 'info',
  onClick = undefined
) => {
  const { showNotifications, todaysNotifications } = state

  return {
    ...state,
    ...(showNotifications && {
      latestNotification: {
        message,
        onClick,
        severity,
      },
    }),
    // Don't show redundant notifications
    todaysNotifications: todaysNotifications.find(
      notification => notification.message === message
    )
      ? todaysNotifications
      : todaysNotifications.concat({ message, onClick, severity }),
  }
}
