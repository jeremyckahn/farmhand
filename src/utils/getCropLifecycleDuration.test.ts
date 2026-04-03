import { carrot } from '../data/items.js'

import { getCropLifecycleDuration } from './getCropLifecycleDuration.js'

describe('getCropLifecycleDuration', () => {
  test('computes lifecycle duration', () => {
    expect(getCropLifecycleDuration(carrot)).toEqual(5)
  })
})
