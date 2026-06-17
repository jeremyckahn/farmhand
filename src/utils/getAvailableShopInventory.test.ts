import {
    scarecrow
} from '../data/items.js'
import {
    cropLifeStage
} from '../enums.js'

import {
    getAvailableShopInventory
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


describe('getAvailableShopInventory', () => {
  test('computes shop inventory that has been unlocked', async () => {
    expect(
      getAvailableShopInventory({
        items: {},
        sprinklerRange: 0,
        tools: {},
        stageFocusType: {},
      } as any)
    ).toEqual([scarecrow])
  })
})
