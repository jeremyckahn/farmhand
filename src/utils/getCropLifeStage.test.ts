import { cropLifeStage } from '../enums.js'

import { testCrop } from '../test-utils/testCrop.js'

import { getCropLifeStage } from './index.js'

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

describe('getCropLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    const itemId = 'carrot'

    expect(getCropLifeStage(testCrop({ itemId, daysWatered: 0 }))).toBe(SEED)
    expect(getCropLifeStage(testCrop({ itemId, daysWatered: 2.5 }))).toBe(
      GROWING
    )
    expect(getCropLifeStage(testCrop({ itemId, daysWatered: 5 }))).toBe(GROWN)
  })
})
