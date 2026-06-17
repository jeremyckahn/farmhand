import {
    COW_MAXIMUM_VALUE_MATURITY_AGE,
    COW_MAXIMUM_VALUE_MULTIPLIER,
    COW_MINIMUM_VALUE_MULTIPLIER
} from '../constants.js'
import {
    cropLifeStage
} from '../enums.js'

import {
    generateCow,
    getCowValue
} from './index.js'


const { SEED, GROWING, GROWN } = cropLifeStage

const percentageStringTests = [
  [0, '0%'],
  [0.5, '50%'],
  [1, '100%'],
  [1.5, '150%'],
  [2, '200%'],
]

const dollarStringTests = [
  [0, '$0.00'],
  [0.5, '$0.50'],
  [1, '$1.00'],
  [1.5, '$1.50'],
  [2, '$2.00'],
]

const integerStringTests = [
  [0, '0'],
  [0.5, '1'],
  [1, '1'],
  [1.5, '2'],
  [2, '2'],
]


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
