import { generateValueAdjustments } from './utils.js'

vitest.mock('../data/maps.js')
vitest.mock('../data/items.js')

describe('generateValueAdjustments', () => {
  let valueAdjustments

  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(1)
    valueAdjustments = generateValueAdjustments({}, {})
  })

  describe('item has a fluctuating price', () => {
    test('updates valueAdjustments by random factor', () => {
      expect(valueAdjustments['carrot']).toEqual(1.5)
      expect(valueAdjustments['pumpkin']).toEqual(1.5)
    })
  })

  describe('item does not have a fluctuating price', () => {
    test('valueAdjustments value is not defined', () => {
      expect(valueAdjustments['sample-field-tool-1']).toEqual(undefined)
    })
  })

  test('factors in price crashes', () => {
    valueAdjustments = generateValueAdjustments(
      { carrot: { itemId: 'carrot', daysRemaining: 1 } },
      {}
    )

    expect(valueAdjustments['carrot']).toEqual(0.5)
  })

  test('factors in price surges', () => {
    valueAdjustments = generateValueAdjustments(
      {},
      { carrot: { itemId: 'carrot', daysRemaining: 1 } }
    )

    expect(valueAdjustments['carrot']).toEqual(1.5)
  })
})
