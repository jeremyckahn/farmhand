import {
  COW_MINIMUM_VALUE_MULTIPLIER,
  COW_MAXIMUM_VALUE_MATURITY_AGE,
  COW_MAXIMUM_VALUE_MULTIPLIER,
} from '../constants.js'

import { getCowValue } from './getCowValue.js'
import { generateCow } from './generateCow.js'

describe('getCowValue', () => {
  const baseWeight = 100

  test('computes value of cow for sale', () => {
    expect(getCowValue(generateCow({ baseWeight, daysOld: 1 }))).toEqual(
      baseWeight * 1.5
    )
  })

  describe('computing sale value', () => {
    describe('young cow (worst value)', () => {
      test('computes cow value', () => {
        expect(
          getCowValue(generateCow({ baseWeight, daysOld: 1 }), true)
        ).toEqual(baseWeight * COW_MINIMUM_VALUE_MULTIPLIER)
      })
    })

    describe('old cow (best value)', () => {
      test('computes cow value', () => {
        expect(
          getCowValue(
            generateCow({
              baseWeight,
              daysOld: COW_MAXIMUM_VALUE_MATURITY_AGE,
            }),
            true
          )
        ).toEqual(baseWeight * COW_MAXIMUM_VALUE_MULTIPLIER)
      })
    })
  })
})
