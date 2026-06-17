import {
    cropLifeStage
} from '../enums.js'

import {
    castToMoney
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


describe('castToMoney', () => {
  test('does not change valid money value', () => {
    expect(castToMoney(1.23)).toEqual(1.23)
  })

  test('rounds up', () => {
    expect(castToMoney(1.235)).toEqual(1.24)
  })

  test('rounds down', () => {
    expect(castToMoney(1.234)).toEqual(1.23)
  })
})
