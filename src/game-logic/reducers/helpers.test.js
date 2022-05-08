import { testCrop } from '../../test-utils'

import { resetWasWatered } from './helpers'

jest.mock('../../data/maps')
jest.mock('../../data/items')

describe('resetWasWatered', () => {
  test('updates wasWateredToday property', () => {
    expect(resetWasWatered(testCrop({ itemId: 'sample-crop-1' }))).toEqual(
      testCrop({ itemId: 'sample-crop-1' })
    )

    expect(
      resetWasWatered(
        testCrop({ itemId: 'sample-crop-2', wasWateredToday: true })
      )
    ).toEqual(testCrop({ itemId: 'sample-crop-2' }))

    expect(resetWasWatered(null)).toBe(null)
  })
})
