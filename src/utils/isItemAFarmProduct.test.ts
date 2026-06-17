import {
    carrot,
    carrotSeed,
    milk1
} from '../data/items.js'
import { carrotSoup } from '../data/recipes.js'
import {
    cropLifeStage
} from '../enums.js'

import { isItemAFarmProduct } from './isItemAFarmProduct.js'


const { SEED, GROWING, GROWN } = cropLifeStage

const percentageStringTests = [
  [0, '0%'],
  [0.5, '50%'],
  [1, '100%'],
  [1.5, '150%'],
  [2, '200%'],
]

const dollarStringTests = [
  [0, '$0.00'],
  [0.5, '$0.50'],
  [1, '$1.00'],
  [1.5, '$1.50'],
  [2, '$2.00'],
]

const integerStringTests = [
  [0, '0'],
  [0.5, '1'],
  [1, '1'],
  [1.5, '2'],
  [2, '2'],
]



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
