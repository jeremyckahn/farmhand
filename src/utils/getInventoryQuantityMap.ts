import { memoize } from './memoize.js'

export const getInventoryQuantityMap = memoize(
  /**
   * @param {{ id: item['id'], quantity: number }[]} inventory
   * @returns {Record<item['id'], number>}
   */
  (inventory: { id: string; quantity: number }[]) =>
    inventory.reduce((acc: Record<string, number>, { id, quantity }) => {
      acc[id] = quantity

      return acc
    }, {})
)
