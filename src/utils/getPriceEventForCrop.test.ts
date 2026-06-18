import { carrot } from '../data/items.js'

import { getPriceEventForCrop } from './getPriceEventForCrop.js'

describe('getPriceEventForCrop', () => {
  test('returns price event', () => {
    expect(getPriceEventForCrop(carrot)).toEqual({
      itemId: carrot.id,
      daysRemaining: 4,
    })
  })
})
