import { testCrop } from '../../test-utils'
import { EXPERIENCE_VALUES } from '../../constants'

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
      jest.resetModules()
      jest.mock('../../constants', () => ({
        EXPERIENCE_VALUES: {},
        PURCHASEABLE_FIELD_SIZES: new Map([
          [1, { columns: 3, rows: 4, price: 1000 }],
        ]),
      }))

      const { purchaseField } = jest.requireActual('./purchaseField')

      const { field } = purchaseField(
        {
          field: [
            [testCrop(), null],
            [null, testCrop()],
          ],
        },
        1
      )
      expect(field).toEqual([
        [testCrop(), null, null],
        [null, testCrop(), null],
        [null, null, null],
        [null, null, null],
      ])
    })
  })
})
