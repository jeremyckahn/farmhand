import { vitest } from 'vitest'

import { standardCowColors, genders } from '../enums.js'
import {
  COW_STARTING_WEIGHT_BASE,
  COW_STARTING_WEIGHT_VARIANCE,
  MALE_COW_WEIGHT_MULTIPLIER,
} from '../constants.js'

import { generateCow } from './generateCow.js'

describe('generateCow', () => {
  describe('randomizer: lower bound', () => {
    beforeEach(() => {
      vitest.spyOn(Math, 'random').mockReturnValue(0)
    })

    const baseCowProperties = {
      color: Object.keys(standardCowColors)[0],
      daysOld: 1,
      id: '123',
      isBred: false,
      name: 'Peach',
    }

    describe('female cows', () => {
      test('generates a cow', () => {
        const baseWeight = Math.round(
          COW_STARTING_WEIGHT_BASE - COW_STARTING_WEIGHT_VARIANCE
        )

        expect(
          generateCow({ gender: genders.FEMALE, id: '123' })
        ).toMatchObject({
          ...baseCowProperties,
          gender: genders.FEMALE,
          baseWeight,
        })
      })
    })

    describe('male cows', () => {
      test('generates a cow', () => {
        const baseWeight = Math.round(
          COW_STARTING_WEIGHT_BASE * MALE_COW_WEIGHT_MULTIPLIER -
            COW_STARTING_WEIGHT_VARIANCE
        )

        expect(generateCow({ gender: genders.MALE, id: '123' })).toMatchObject({
          ...baseCowProperties,
          gender: genders.MALE,
          baseWeight,
        })
      })
    })
  })

  describe('randomizer: upper bound', () => {
    beforeEach(() => {
      vitest.spyOn(Math, 'random').mockReturnValue(1)
    })

    test('generates a cow', () => {
      const baseWeight =
        COW_STARTING_WEIGHT_BASE * MALE_COW_WEIGHT_MULTIPLIER +
        COW_STARTING_WEIGHT_VARIANCE

      expect(generateCow({ id: '123' })).toMatchObject({
        baseWeight,
        color: Object.keys(standardCowColors).pop(),
        daysOld: 1,
        gender: Object.keys(genders).pop(),
        isBred: false,
        name: 'Peach',
      })
    })
  })
})
