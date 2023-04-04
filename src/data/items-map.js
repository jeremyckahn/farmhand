/** @typedef {import("../index").farmhand.item} farmhand.item */

import * as items from '../data/items'

// TODO: This object is unsafe to use directly. Move it to a private variable
// in src/data/maps.js.

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
