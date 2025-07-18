import { testCrop, testState } from '../../test-utils/index.js'
import { EXPERIENCE_VALUES, PURCHASEABLE_FIELD_SIZES } from '../../constants.js'

import { purchaseField } from './purchaseField.js'

describe('purchaseField', () => {
  /** @type {farmhand.state} */
  let state

  beforeEach(() => {
    state = testState({
      purchasedField: 0,
      money: 1500,
      experience: 0,
      field: [[]],
    })
  })

  test('updates purchasedField', () => {
    const { purchasedField } = purchaseField(state, 0)
    expect(purchasedField).toEqual(0)
  })

  test('prevents repurchasing options', () => {
    state.purchasedField = 2
    const { purchasedField } = purchaseField(state, 1)
    expect(purchasedField).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseField(state, 1)
    expect(money).toEqual(500)
  })

  test('adds experience', () => {
    const { experience } = purchaseField(state, 1)

    expect(experience).toEqual(EXPERIENCE_VALUES.FIELD_EXPANDED)
  })

  describe('field expansion', () => {
    test('field expands without destroying existing data', () => {
      const expectedField = []
      const fieldSize = PURCHASEABLE_FIELD_SIZES.get(1)

      if (!fieldSize) {
        throw new Error('Field size not found')
      }

      for (let y = 0; y < fieldSize.rows; y++) {
        const row = []
        for (let x = 0; x < fieldSize.columns; x++) {
          row.push(null)
        }
        expectedField.push(row)
      }

      state.field = [
        [testCrop(), null],
        [null, testCrop()],
      ]

      const { field } = purchaseField(state, 1)

      // @ts-expect-error - We know these positions exist and can hold crop data
      expectedField[0][0] = testCrop()
      // @ts-expect-error - We know these positions exist and can hold crop data
      expectedField[1][1] = testCrop()

      expect(field).toEqual(expectedField)
    })
  })
})
