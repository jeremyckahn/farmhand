import { itemsMap } from '../data/maps.js'

import { memoize } from './memoize.js'
import { isItemAFarmProduct } from './isItemAFarmProduct.js'

// @ts-expect-error
export const farmProductsSold = memoize(
  /**
   * @param {Partial<Record<string, number>>} itemsSold
   * @returns {number}
   */
  itemsSold =>
    Object.entries(itemsSold).reduce(
      (sum, [itemId, numberSold]) =>
        // @ts-expect-error
        sum + (isItemAFarmProduct(itemsMap[itemId]) ? numberSold || 0 : 0),
      0
    )
)
