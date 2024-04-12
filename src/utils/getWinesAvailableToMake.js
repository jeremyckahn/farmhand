/**
 * @typedef {import('../index').farmhand.state['itemsSold']} itemsSold
 * @typedef {import('../index').farmhand.item} item
 */
import { itemsMap } from '../data/maps'

/**
 * @param {itemsSold} itemsSold
 * @returns {item['id'][]}
 */
export function getWinesAvailableToMake(itemsSold) {
  const winesAvailableToMake = Object.entries(itemsSold).reduce((
    /** @type {item['id'][]} */ acc,
    [itemId, quantity]
  ) => {
    const item = itemsMap[itemId]

    // FIXME: Verify that item is a grape
    if (quantity > 0) {
      acc.push(item.id)
    }

    return acc
  }, [])

  return winesAvailableToMake
}
