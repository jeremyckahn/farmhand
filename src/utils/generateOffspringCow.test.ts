import { vitest } from 'vitest'

import { standardCowColors, genders, cowColors } from '../enums.js'

import { generateCow } from './generateCow.js'
import { generateOffspringCow } from './generateOffspringCow.js'
import { chooseRandom } from './chooseRandom.js'

describe('generateOffspringCow', () => {
  let maleCow, femaleCow

  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(1)

    maleCow = generateCow({
      baseWeight: 2200,
      color: standardCowColors.ORANGE,
      colorsInBloodline: {
        [standardCowColors.ORANGE]: true,
        [standardCowColors.YELLOW]: true,
      },
      gender: genders.MALE,
    })

    femaleCow = generateCow({
      baseWeight: 2000,
      color: standardCowColors.GREEN,
      colorsInBloodline: {
        [standardCowColors.GREEN]: true,
        [standardCowColors.WHITE]: true,
      },
      gender: genders.FEMALE,
    })
  })

  test('generates offspring', () => {
    expect(generateOffspringCow(maleCow, femaleCow, 'foo')).toMatchObject({
      color: chooseRandom([femaleCow.color, maleCow.color]),
      colorsInBloodline: {
        [standardCowColors.GREEN]: true,
        [standardCowColors.ORANGE]: true,
        [standardCowColors.WHITE]: true,
        [standardCowColors.YELLOW]: true,
      },
      baseWeight: 2100,
      isBred: true,
      ownerId: 'foo',
      originalOwnerId: 'foo',
    })
  })

  test('order of parents does not matter', () => {
    const idProps = { id: '123' }

    const { ...offspring1 } = generateOffspringCow(
      maleCow,
      femaleCow,
      'foo',
      idProps
    )
    const { ...offspring2 } = generateOffspringCow(
      femaleCow,
      maleCow,
      'foo',
      idProps
    )

    expect(offspring1).toEqual(offspring2)
  })

  test('two cows of the same gender throw an error', () => {
    expect(() => generateOffspringCow(femaleCow, femaleCow, 'foo')).toThrow()
  })

  describe('rainbow cows', () => {
    test('cows with all of the colors in their bloodline are rainbow cows', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(1)

      maleCow = generateCow({
        baseWeight: 2200,
        color: standardCowColors.ORANGE,
        colorsInBloodline: {
          [standardCowColors.BLUE]: true,
          [standardCowColors.BROWN]: true,
          [standardCowColors.GREEN]: true,
          [standardCowColors.ORANGE]: true,
          [standardCowColors.PURPLE]: true,
          [standardCowColors.WHITE]: true,
        },
        gender: genders.MALE,
      })

      femaleCow = generateCow({
        baseWeight: 2000,
        color: standardCowColors.GREEN,
        colorsInBloodline: {
          [standardCowColors.YELLOW]: true,
        },
        gender: genders.FEMALE,
      })

      expect(generateOffspringCow(maleCow, femaleCow, 'foo')).toMatchObject({
        color: cowColors.RAINBOW,
        colorsInBloodline: {
          [standardCowColors.BLUE]: true,
          [standardCowColors.BROWN]: true,
          [standardCowColors.GREEN]: true,
          [standardCowColors.ORANGE]: true,
          [standardCowColors.PURPLE]: true,
          [standardCowColors.WHITE]: true,
          [standardCowColors.YELLOW]: true,
        },
        baseWeight: 2100,
        isBred: true,
        ownerId: 'foo',
        originalOwnerId: 'foo',
      })
    })

    test('rainbow color is not stored in bloodline', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(1)

      maleCow = generateCow({
        baseWeight: 2200,
        color: cowColors.RAINBOW,
        colorsInBloodline: {
          [standardCowColors.BLUE]: true,
          [standardCowColors.BROWN]: true,
          [standardCowColors.GREEN]: true,
          [standardCowColors.ORANGE]: true,
          [standardCowColors.PURPLE]: true,
          [standardCowColors.WHITE]: true,
          [standardCowColors.YELLOW]: true,
        },
        gender: genders.FEMALE,
      })

      femaleCow = generateCow({
        baseWeight: 2000,
        color: standardCowColors.WHITE,
        colorsInBloodline: {
          [standardCowColors.WHITE]: true,
        },
        gender: genders.MALE,
      })

      const { colorsInBloodline } = generateOffspringCow(
        maleCow,
        femaleCow,
        'foo'
      )

      expect(colorsInBloodline).toEqual({
        [standardCowColors.BLUE]: true,
        [standardCowColors.BROWN]: true,
        [standardCowColors.GREEN]: true,
        [standardCowColors.ORANGE]: true,
        [standardCowColors.PURPLE]: true,
        [standardCowColors.WHITE]: true,
        [standardCowColors.YELLOW]: true,
      })
    })
  })
})
