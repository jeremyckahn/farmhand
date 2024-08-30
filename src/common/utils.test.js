import { generateValueAdjustments } from './utils'

vitest.mock('../data/maps')
vitest.mock('../data/items')

describe('generateValueAdjustments', () => {
  let valueAdjustments

  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(1)
    valueAdjustments = generateValueAdjustments({}, {})
  })

  describe('item has a fluctuating price', () => {
    test('updates valueAdjustments by random factor', () => {
      expect(valueAdjustments['sample-crop-1']).toEqual(1.5)
      expect(valueAdjustments['sample-crop-2']).toEqual(1.5)
    })
  })

  describe('item does not have a fluctuating price', () => {
    test('valueAdjustments value is not defined', () => {
      expect(valueAdjustments['sample-field-tool-1']).toEqual(undefined)
    })
  })

  test('factors in price crashes', () => {
    valueAdjustments = generateValueAdjustments(
      { 'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 } },
      {}
    )

    expect(valueAdjustments['sample-crop-1']).toEqual(0.5)
  })

  test('factors in price surges', () => {
    valueAdjustments = generateValueAdjustments(
      {},
      { 'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 } }
    )

    expect(valueAdjustments['sample-crop-1']).toEqual(1.5)
  })
})
