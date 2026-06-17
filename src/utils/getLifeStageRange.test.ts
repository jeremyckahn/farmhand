import {
    cropLifeStage
} from '../enums.js'

import {
    getLifeStageRange
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


describe('getLifeStageRange', () => {
  test('converts a cropTimeline to an array of stages', () => {
    expect(getLifeStageRange([1, 2])).toEqual([SEED, GROWING, GROWING])
  })

  test('converts a multi-stage growing cycle into the expected stages', () => {
    expect(getLifeStageRange([2, 1, 2, 1])).toEqual([
      SEED,
      SEED,
      GROWING,
      GROWING,
      GROWING,
      GROWING,
    ])
  })
})
