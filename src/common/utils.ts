import { itemsMap } from '../data/maps.js'

import { randomNumberService } from './services/randomNumber.ts'

/**
 * @param stream Optional name of the random number stream being drawn from.
 * See RandomNumberService#generateRandomNumber.
 */
export const random = (stream?: string) => {
  return randomNumberService.generateRandomNumber(stream)
}

export const generateValueAdjustments = (
  priceCrashes: Partial<Record<string, farmhand.priceEvent>> = {},
  priceSurges: Partial<Record<string, farmhand.priceEvent>> = {}
): Record<string, number> =>
  Object.keys(itemsMap).reduce((acc, key) => {
    if (itemsMap[key].doesPriceFluctuate) {
      if (priceCrashes[key]) {
        acc[key] = 0.5
      } else if (priceSurges[key]) {
        acc[key] = 1.5
      } else {
        acc[key] = random(`valueAdjustment:${key}`) + 0.5
      }
    }

    return acc
  }, {} as Record<string, number>)
