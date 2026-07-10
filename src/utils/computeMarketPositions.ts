import { itemsMap } from '../data/maps.js'

export const computeMarketPositions = (
  todaysStartingInventory: farmhand.state['todaysStartingInventory'],
  todaysPurchases: farmhand.state['todaysPurchases'],
  inventory: Array<{ id: string; quantity: number }>
): Record<string, number> =>
  inventory.reduce(
    (acc: Record<string, number>, { id, quantity: endingPosition }) => {
      const startingInventory = todaysStartingInventory[id] || 0
      const purchaseQuantity = todaysPurchases[id] || 0

      if (!itemsMap[id].doesPriceFluctuate) {
        return acc
      }

      if (startingInventory !== endingPosition) {
        if (
          endingPosition < startingInventory ||
          endingPosition < purchaseQuantity
        ) {
          acc[id] = -1
        } else if (
          endingPosition > startingInventory ||
          endingPosition > purchaseQuantity
        ) {
          acc[id] = 1
        }
      }

      return acc
    },
    {}
  )
