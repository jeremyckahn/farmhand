/**
 * @typedef {farmhand.state['itemsSold']} itemsSold
 * @typedef {farmhand.item} item
 * @typedef {farmhand.cropVariety} cropVariety
 * @typedef {farmhand.grape} grape
 */
import { isGrape } from '../data/crops/grape.js'
import { itemsMap } from '../data/maps.js'


const getGrapesSold = (itemsSold: farmhand.state['itemsSold']): grape[] => {
  const grapesSold = Object.entries(itemsSold).reduce(
    (acc: farmhand.grape[], [itemId, quantity]) => {
      const item = itemsMap[itemId]

      if ((quantity || 0) > 0 && isGrape(item)) {
        acc.push(item)
      }

      return acc
    },
    []
  )

  return grapesSold
}


export function getWineVarietiesAvailableToMake(
  itemsSold: farmhand.state['itemsSold']
): any {
  const grapesSold = getGrapesSold(itemsSold)

  const winesVarietiesAvailableToMake = grapesSold.map(({ variety }) => variety)

  return winesVarietiesAvailableToMake
}
