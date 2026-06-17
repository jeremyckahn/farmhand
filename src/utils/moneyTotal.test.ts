import {
    cropLifeStage
} from '../enums.js'

import {
    moneyTotal
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


describe('moneyTotal', () => {
  test('adds numbers', () => {
    expect(moneyTotal(0.1, 0.2)).toEqual(0.3)
  })

  test('subtracts numbers', () => {
    expect(moneyTotal(1000, -999.99)).toEqual(0.01)
  })
})
