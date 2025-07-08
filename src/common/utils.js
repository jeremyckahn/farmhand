import { itemsMap } from '../data/maps.js'

import { randomNumberService } from './services/randomNumber.js'

export const random = () => {
  return randomNumberService.generateRandomNumber()
}

/**
 * @param {Partial<Record<string, farmhand.priceEvent>>} priceCrashes
 * @param {Partial<Record<string, farmhand.priceEvent>>} priceSurges
 * @returns {Record<string, number>}
 */
export const generateValueAdjustments = (priceCrashes = {}, priceSurges = {}) =>
  Object.keys(itemsMap).reduce((acc, key) => {
    if (itemsMap[key].doesPriceFluctuate) {
      if (priceCrashes[key]) {
        acc[key] = 0.5
      } else if (priceSurges[key]) {
        acc[key] = 1.5
      } else {
        acc[key] = random() + 0.5
      }
    }

    return acc
  }, {})
