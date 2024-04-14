/**
 * @typedef {import('../index').farmhand.state['itemsSold']} itemsSold
 * @typedef {import('../index').farmhand.item} item
 * @typedef {import('../index').farmhand.cropVariety} cropVariety
 * @typedef {import('../data/crops/grape').Grape} Grape
 */
import { isGrape } from '../data/crops/grape'
import { itemsMap } from '../data/maps'

/**
 * @param {itemsSold} itemsSold
 * @returns {Grape[]}
 */
const getGrapesSold = itemsSold => {
  const grapesSold = Object.entries(itemsSold).reduce((
    /** @type {Grape[]} */ acc,
    [itemId, quantity]
  ) => {
    const item = itemsMap[itemId]

    if (quantity > 0 && isGrape(item)) {
      acc.push(item)
    }

    return acc
  }, [])

  return grapesSold
}

/**
 * @param {itemsSold} itemsSold
 * @returns {item['id'][]}
 */
export function getWinesAvailableToMake(itemsSold) {
  // FIXME: Use this
  // eslint-disable-next-line no-unused-vars
  const grapesSold = getGrapesSold(itemsSold)

  // FIXME: Populate this
  const winesAvailableToMake = []

  return winesAvailableToMake
}
