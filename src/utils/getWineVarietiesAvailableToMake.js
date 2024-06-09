/**
 * @typedef {import('../index').farmhand.state['itemsSold']} itemsSold
 * @typedef {import('../index').farmhand.item} item
 * @typedef {import('../index').farmhand.cropVariety} cropVariety
 * @typedef {import('../index').farmhand.grape} grape
 * @typedef {import('../enums').grapeVariety} grapeVariety
 */
import { isGrape } from '../data/crops/grape'
import { itemsMap } from '../data/maps'

/**
 * @param {itemsSold} itemsSold
 * @returns {grape[]}
 */
const getGrapesSold = itemsSold => {
  const grapesSold = Object.entries(itemsSold).reduce((
    /** @type {grape[]} */ acc,
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
 * @returns {grapeVariety[]}
 */
export function getWineVarietiesAvailableToMake(itemsSold) {
  const grapesSold = getGrapesSold(itemsSold)

  const winesVarietiesAvailableToMake = grapesSold.map(({ variety }) => variety)

  return winesVarietiesAvailableToMake
}
