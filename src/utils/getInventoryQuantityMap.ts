import { memoize } from './memoize.js'

export const getInventoryQuantityMap = memoize(
  (
    inventory: { id: string; quantity: number }[]
  ): Record<farmhand.item['id'], number> =>
    inventory.reduce((acc: Record<string, number>, { id, quantity }) => {
      acc[id] = quantity

      return acc
    }, {})
)
