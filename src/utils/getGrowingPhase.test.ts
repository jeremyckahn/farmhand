import {
    cropLifeStage
} from '../enums.js'

import {
    getGrowingPhase
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


describe('getGrowingPhase', () => {
  test.each([
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 3],
  ])('it returns phase %s when days watered is %s', (phase, daysWatered) => {
    const crop = { itemId: 'potato', daysWatered }

    expect(getGrowingPhase(crop as any)).toEqual(phase)
  })
})
