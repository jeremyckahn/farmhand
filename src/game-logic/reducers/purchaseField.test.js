import { testCrop } from '../../test-utils'
import { EXPERIENCE_VALUES, PURCHASEABLE_FIELD_SIZES } from '../../constants'

import { purchaseField } from './purchaseField'

describe('purchaseField', () => {
  test('updates purchasedField', () => {
    const { purchasedField } = purchaseField({ purchasedField: 0 }, 0)
    expect(purchasedField).toEqual(0)
  })

  test('prevents repurchasing options', () => {
    const { purchasedField } = purchaseField({ purchasedField: 2 }, 1)
    expect(purchasedField).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = purchaseField({ money: 1500, field: [[]] }, 1)
    expect(money).toEqual(500)
  })

  test('adds experience', () => {
    const { experience } = purchaseField({ experience: 0, field: [[]] }, 1)

    expect(experience).toEqual(EXPERIENCE_VALUES.FIELD_EXPANDED)
  })

  describe('field expansion', () => {
    test('field expands without destroying existing data', () => {
      const expectedField = []
      const fieldSize = PURCHASEABLE_FIELD_SIZES.get(1)

      for (let y = 0; y < fieldSize.rows; y++) {
        const row = []
        for (let x = 0; x < fieldSize.columns; x++) {
          row.push(null)
        }
        expectedField.push(row)
      }

      const { field } = purchaseField(
        {
          field: [
            [testCrop(), null],
            [null, testCrop()],
          ],
        },
        1
      )

      expectedField[0][0] = testCrop()
      expectedField[1][1] = testCrop()

      expect(field).toEqual(expectedField)
    })
  })
})
