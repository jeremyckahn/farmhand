import { carrot } from '../data/items'

import { getCropLifecycleDuration } from './getCropLifecycleDuration'

describe('getCropLifecycleDuration', () => {
  test('computes lifecycle duration', () => {
    expect(getCropLifecycleDuration(carrot)).toEqual(5)
  })
})
