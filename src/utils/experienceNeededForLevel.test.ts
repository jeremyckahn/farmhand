import {
    cropLifeStage
} from '../enums.js'

import {
    experienceNeededForLevel
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


describe('experienceNeededForLevel', () => {
  test.each([
    [0, 1],
    [100, 2],
    [400, 3],
    [980100, 100],
  ])('it returns %s experience for level %s', (experienceNeeded, levelNum) => {
    expect(experienceNeededForLevel(levelNum)).toEqual(experienceNeeded)
  })
})
