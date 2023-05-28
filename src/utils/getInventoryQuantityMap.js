/**
 * @typedef {import("../index").farmhand.item} item
 */
import { memoize } from './memoize'

/**
 * @param {item[]} inventory
 * @returns {Object}
 */
export const getInventoryQuantityMap = memoize(
  /**
   * @param {item[]} inventory
   * @returns {Object}
   */
  inventory =>
    inventory.reduce((acc, { id, quantity }) => {
      acc[id] = quantity
      return acc
    }, {})
)
