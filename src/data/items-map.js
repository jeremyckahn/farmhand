/** @typedef {import("../index").farmhand.item} farmhand.item */

import * as items from '../data/items'

/**
 * @type {Object.<string, farmhand.item>}
 */
export default {
  ...Object.keys(items).reduce((acc, itemName) => {
    const item = items[itemName]
    acc[item.id] = item
    return acc
  }, {}),
}
