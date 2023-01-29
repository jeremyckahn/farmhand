import {
  sampleItem1,
  sampleFieldTool1,
  sampleCropSeedsItem1,
} from '../../data/items'

import {
  computePlayerInventory,
  getFieldToolInventory,
  getPlantableCropInventory,
} from './Farmhand'

jest.mock('../../data/maps')
jest.mock('../../data/items')

describe('private helpers', () => {
  describe('computePlayerInventory', () => {
    const inventory = [{ quantity: 1, playerId: 'sample-item-1' }]

    test('computes inventory with no value adjustments', () => {
      const playerInventory = computePlayerInventory(inventory, {})

      expect(playerInventory).toEqual([{ quantity: 1, ...sampleItem1 }])
    })

    test('computes inventory with value adjustments', () => {
      const playerInventory = computePlayerInventory(inventory, {
        'sample-item-1': 2,
      })

      expect(playerInventory).toEqual([
        { ...sampleItem1, quantity: 1, value: 2 },
      ])
    })
  })

  describe('getFieldToolInventory', () => {
    test('selects field tools from inventory', () => {
      const fieldToolInventory = getFieldToolInventory([
        sampleFieldTool1,
        sampleCropSeedsItem1,
      ])

      expect(fieldToolInventory).toEqual([sampleFieldTool1])
    })
  })

  describe('getPlantableCropInventory', () => {
    test('selects plantable crop items from inventory', () => {
      const inventory = [{ playerId: 'sample-crop-seeds-1' }, { playerId: 'sample-item-1' }]
      const plantableCropInventory = getPlantableCropInventory(inventory)

      expect(plantableCropInventory).toEqual([sampleCropSeedsItem1])
    })
  })
})
