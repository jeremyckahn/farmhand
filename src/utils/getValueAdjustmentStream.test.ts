import { getValueAdjustmentStream } from './getValueAdjustmentStream.js'

describe('getValueAdjustmentStream', () => {
  test('returns the price adjustment stream for an item', () => {
    expect(getValueAdjustmentStream('carrot-seed')).toEqual(
      'valueAdjustment:carrot-seed'
    )
  })
})
