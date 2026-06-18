import { genders } from '../enums.js'
import {
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
  COW_FERTILIZER_PRODUCTION_RATE_FASTEST,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
} from '../constants.js'

import { getCowFertilizerProductionRate } from './getCowFertilizerProductionRate.js'
import { generateCow } from './generateCow.js'

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
