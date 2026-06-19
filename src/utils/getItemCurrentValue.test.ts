import { carrot, rainbowFertilizer } from '../data/items.js'

import { getItemCurrentValue } from './getItemCurrentValue.js'

describe('getItemCurrentValue', () => {
  let valueAdjustments: Record<string, number>

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
