import * as items from '../data/items'

export default {
  ...Object.keys(items).reduce((acc, itemName) => {
    const item = items[itemName]
    acc[item.playerId] = item
    return acc
  }, {}),
}
