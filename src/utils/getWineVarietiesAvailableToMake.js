/**
 * @typedef {farmhand.state['itemsSold']} itemsSold
 * @typedef {farmhand.item} item
 * @typedef {farmhand.cropVariety} cropVariety
 * @typedef {farmhand.grape} grape
 * @typedef {grapeVariety} grapeVariety
 */
import { isGrape } from '../data/crops/grape.js'
import { itemsMap } from '../data/maps.js'

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
