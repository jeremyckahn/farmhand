import { itemsMap } from '../data/maps.js'

import { memoize } from './memoize.js'
import { isItemAFarmProduct } from './isItemAFarmProduct.js'

export const farmProductsSold = memoize(
  /**
   * @param itemsSold
   * @returns {number}
   */
  (itemsSold: Partial<Record<string, number>>) =>
    Object.entries(itemsSold).reduce(
      (sum, [itemId, numberSold]) =>
        sum +
        (isItemAFarmProduct(itemsMap[itemId] as farmhand.item)
          ? numberSold || 0
          : 0),
      0
    )
)
