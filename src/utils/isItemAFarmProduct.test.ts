import { carrotSeed, carrot, milk1 } from '../data/items.js'
import { carrotSoup } from '../data/recipes.js'

import { isItemAFarmProduct } from './isItemAFarmProduct.js'

describe('isItemAFarmProduct', () => {
  test.each([
    ['seed', carrotSeed, false],
    ['crop', carrot, true],
    ['milk', milk1, true],
    ['crafted item', carrotSoup, true],
  ])('when item is a %s', (_itemType, item, isAFarmProduct) => {
    expect(isItemAFarmProduct(item)).toBe(isAFarmProduct)
  })
})
