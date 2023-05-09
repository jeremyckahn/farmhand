/** @typedef {import("../index").farmhand.item} farmhand.item */

import * as items from '../data/items'

/**
 * ⚠️⚠️⚠️ This is a low-level object that is UNSAFE to use directly outside of
 * initial bootup. Use itemsMap in src/data/maps.js instead.
 * @type {Object.<string, farmhand.item>}
 * @deprecated This is not actually deprecated. It's just marked as such to
 * make it more obvious during development that this should generally not be
 * used directly.
 */
export default {
  ...Object.keys(items).reduce((acc, itemName) => {
    const item = items[itemName]
    acc[item.id] = item
    return acc
  }, {}),
}
