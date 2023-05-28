import { sampleCropItem1 } from '../data/items'

import { getCropLifecycleDuration } from './getCropLifecycleDuration'

jest.mock('../data/items')

describe('getCropLifecycleDuration', () => {
  test('computes lifecycle duration', () => {
    expect(getCropLifecycleDuration(sampleCropItem1)).toEqual(3)
  })
})
