import {
    I_AM_RICH_BONUSES
} from '../constants.js'
import {
    cropLifeStage
} from '../enums.js'

import {
    getSalePriceMultiplier
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


describe('getSalePriceMultiplier', () => {
  test('it returns 1 when there are no completedAchievements', () => {
    expect(getSalePriceMultiplier({})).toEqual(1)
  })

  test('it returns 1 when there are no relevant completedAchievements', () => {
    const completedAchievements = {
      irrelevant: true,
      'also-irrelevant': true,
    }

    expect(getSalePriceMultiplier(completedAchievements)).toEqual(1)
  })

  const iAmRichAchievements = [
    ['i-am-rich-1', 1 + I_AM_RICH_BONUSES[0]],
    ['i-am-rich-2', 1 + I_AM_RICH_BONUSES[1]],
    ['i-am-rich-3', 1 + I_AM_RICH_BONUSES[2]],
  ]

  describe.each(iAmRichAchievements)(
    'with I am Rich achievements completed',
    (achievementId, expectedMultiplier) => {
      test(`${achievementId} returns ${expectedMultiplier}`, () => {
        const completedAchievements = {
          [achievementId]: true,
        }

        expect(getSalePriceMultiplier(completedAchievements)).toEqual(
          expectedMultiplier
        )
      })
    }
  )
})
