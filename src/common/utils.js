/** @typedef {import("../index").farmhand.priceEvent} farmhand.priceEvent */
import { itemsMap } from '../data/maps'

import { randomNumberService } from './services/randomNumber'

export const random = () => {
  return randomNumberService.generateRandomNumber()
}

/**
 * @param {farmhand.priceEvent} [priceCrashes]
 * @param {farmhand.priceEvent} [priceSurges]
 * @returns {Object}
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
