import { generateValueAdjustments, randomChoice } from './utils'

jest.mock('../data/maps')
jest.mock('../data/items')

describe('generateValueAdjustments', () => {
  let valueAdjustments

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(1)
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

  describe('factors in price crashes', () => {
    valueAdjustments = generateValueAdjustments(
      { 'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 } },
      {}
    )

    expect(valueAdjustments['sample-crop-1']).toEqual(0.5)
  })

  describe('factors in price surges', () => {
    valueAdjustments = generateValueAdjustments(
      {},
      { 'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 } }
    )

    expect(valueAdjustments['sample-crop-1']).toEqual(1.5)
  })
})

describe('randomChoice', () => {
  const choices = [
    { weight: 0.2, name: 'first-choice' },
    { weight: 0.5, name: 'second-choice' },
    { weight: 0.3, name: 'third-choice' },
  ]

  test('it returns a choice at random', () => {
    const choice = randomChoice(choices)
    expect(choices.includes(choice)).toEqual(true)
  })
})
