import {
    cropLifeStage
} from '../enums.js'

import {
    getFinalCropItemIdFromSeedItemId
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


describe('getFinalCropItemIdFromSeedItemId', () => {
  test('gets "final" crop item id from seed item id', () => {
    expect(getFinalCropItemIdFromSeedItemId('carrot-seed')).toEqual('carrot')
  })

  test('gets "final" crop item id from seed item id with varieties', () => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
    expect(getFinalCropItemIdFromSeedItemId('grape-seed')).toEqual(
      'grape-chardonnay'
    )
  })
})
