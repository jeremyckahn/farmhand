import { itemsMap } from '../data/maps'

import { memoize } from './memoize'
import { isItemAFarmProduct } from './isItemAFarmProduct'

export const farmProductsSold = memoize(
  /**
   * @param {Record<string, number>} itemsSold
   * @returns {number}
   */
  itemsSold =>
    Object.entries(itemsSold).reduce(
      (sum, [itemId, numberSold]) =>
        sum + (isItemAFarmProduct(itemsMap[itemId]) ? numberSold : 0),
      0
    )
)
