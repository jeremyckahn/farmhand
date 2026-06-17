import {
    cropLifeStage
} from '../enums.js'

import {
    get7DayAverage
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


describe('get7DayAverage', () => {
  test('calculates 7 day revenue average', () => {
    expect(get7DayAverage([])).toBe(0)
    expect(get7DayAverage([-1, -1, -1, -1, -1, -1, -1])).toBe(-1)
    expect(get7DayAverage([1, 1, 1, 1, 1, 1, 1])).toBe(1)
    expect(get7DayAverage([1, 2, 3, 4, 5, 6, 7])).toBe(4)
  })
})
