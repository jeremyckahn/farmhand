import { itemsMap } from '../data/maps.ts'

import { memoize } from './memoize.ts'
import { isItemAFarmProduct } from './isItemAFarmProduct.ts'

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
