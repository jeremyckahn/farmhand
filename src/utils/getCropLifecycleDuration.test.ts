import { carrot } from '../data/items.ts'

import { getCropLifecycleDuration } from './getCropLifecycleDuration.ts'

describe('getCropLifecycleDuration', () => {
  test('computes lifecycle duration', () => {
    expect(getCropLifecycleDuration(carrot)).toEqual(5)
  })
})
