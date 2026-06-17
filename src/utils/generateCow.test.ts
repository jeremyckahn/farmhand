import {
    COW_STARTING_WEIGHT_BASE,
    COW_STARTING_WEIGHT_VARIANCE,
    MALE_COW_WEIGHT_MULTIPLIER
} from '../constants.js'
import {
    cropLifeStage,
    genders,
    standardCowColors
} from '../enums.js'

import {
    generateCow
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
