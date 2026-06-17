import {
    cropLifeStage
} from '../enums.js'

import {
    getRandomUnlockedCrop
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


describe('getRandomUnlockedCrop', () => {
  test('gets a random unlocked crop', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(1)
    const crop = getRandomUnlockedCrop(['carrot-seed', 'pumpkin-seed'])
    expect(crop.id).toEqual('pumpkin')
  })

  test('gets a random unlocked crop with varieties', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
    const crop = getRandomUnlockedCrop(['grape-seed'])
    expect(crop.id).toEqual('grape-chardonnay')
  })
})
