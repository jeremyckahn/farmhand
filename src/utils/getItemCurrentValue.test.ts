import {
    carrot,
    rainbowFertilizer
} from '../data/items.js'
import {
    cropLifeStage
} from '../enums.js'

import {
    getItemCurrentValue
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


describe('getItemCurrentValue', () => {
  let valueAdjustments

  beforeEach(() => {
    valueAdjustments = {
      carrot: 1.5,
      'rainbow-fertilizer': 1.5,
    }
  })

  describe('stable value item', () => {
    test('computes value', () => {
      expect(getItemCurrentValue(carrot, valueAdjustments)).toEqual(
        carrot.value * 1.5
      )
    })
  })

  describe('fluctuating value item', () => {
    test('computes value', () => {
      expect(getItemCurrentValue(rainbowFertilizer, valueAdjustments)).toEqual(
        rainbowFertilizer.value
      )
    })
  })
})
