/**
 * @typedef {import("../index").farmhand.item} item
 */
import { memoize } from './memoize'

export const getInventoryQuantityMap = memoize(
  /**
   * @param {{ id: item['id'], quantity: number }[]} inventory
   * @returns {Record<item['id'], number>}
   */
  inventory =>
    inventory.reduce((acc, { id, quantity }) => {
      acc[id] = quantity

      return acc
    }, {})
)
