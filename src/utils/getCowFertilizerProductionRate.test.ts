import {
    COW_FERTILIZER_PRODUCTION_RATE_FASTEST,
    COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
    COW_WEIGHT_MULTIPLIER_MAXIMUM,
    COW_WEIGHT_MULTIPLIER_MINIMUM
} from '../constants.js'
import {
    cropLifeStage,
    genders
} from '../enums.js'

import {
    generateCow,
    getCowFertilizerProductionRate
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


describe('getCowFertilizerProductionRate', () => {
  describe('non-male cows', () => {
    test('computes correct fertilizer production rate', () => {
      expect(
        getCowFertilizerProductionRate(
          generateCow({
            gender: genders.FEMALE,
          })
        )
      ).toEqual(Infinity)
    })
  })

  describe('male cows', () => {
    const baseCow = generateCow({ gender: genders.MALE })

    describe('minimal weightMultiplier', () => {
      test('computes correct fertilizer production rate', () => {
        expect(
          getCowFertilizerProductionRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
          })
        ).toEqual(COW_FERTILIZER_PRODUCTION_RATE_SLOWEST)
      })
    })

    describe('median weightMultiplier', () => {
      test('computes correct fertilizer production rate', () => {
        expect(
          getCowFertilizerProductionRate({ ...baseCow, weightMultiplier: 1 })
        ).toEqual(
          (COW_FERTILIZER_PRODUCTION_RATE_SLOWEST +
            COW_FERTILIZER_PRODUCTION_RATE_FASTEST) /
            2
        )
      })
    })

    describe('maximum weightMultiplier', () => {
      test('computes correct fertilizer production rate', () => {
        expect(
          getCowFertilizerProductionRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM,
          })
        ).toEqual(COW_FERTILIZER_PRODUCTION_RATE_FASTEST)
      })
    })
  })
})
