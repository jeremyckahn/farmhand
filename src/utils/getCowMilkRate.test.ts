import { genders } from '../enums.js'
import {
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  COW_MILK_RATE_SLOWEST,
  COW_MILK_RATE_FASTEST,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
} from '../constants.js'

import { getCowMilkRate } from './getCowMilkRate.js'
import { generateCow } from './generateCow.js'

describe('getCowMilkRate', () => {
  describe('non-female cows', () => {
    test('computes correct milk rate', () => {
      expect(
        getCowMilkRate(
          generateCow({
            gender: genders.MALE,
          })
        )
      ).toEqual(Infinity)
    })
  })

  describe('female cows', () => {
    const baseCow = generateCow({ gender: genders.FEMALE })

    describe('minimal weightMultiplier', () => {
      test('computes correct milk rate', () => {
        expect(
          getCowMilkRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
          })
        ).toEqual(COW_MILK_RATE_SLOWEST)
      })
    })

    describe('median weightMultiplier', () => {
      test('computes correct milk rate', () => {
        expect(getCowMilkRate({ ...baseCow, weightMultiplier: 1 })).toEqual(
          (COW_MILK_RATE_SLOWEST + COW_MILK_RATE_FASTEST) / 2
        )
      })
    })

    describe('maximum weightMultiplier', () => {
      test('computes correct milk rate', () => {
        expect(
          getCowMilkRate({
            ...baseCow,
            weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM,
          })
        ).toEqual(COW_MILK_RATE_FASTEST)
      })
    })
  })
})
