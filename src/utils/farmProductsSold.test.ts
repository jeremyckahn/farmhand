import { carrot, carrotSeed } from '../data/items.js'

import { farmProductsSold } from './farmProductsSold.js'

describe('farmProductsSold', () => {
  test('sums products sold', () => {
    expect(
      farmProductsSold({
        [carrot.id]: 3,
        [carrotSeed.id]: 2,
      })
    ).toEqual(3)
  })
})
