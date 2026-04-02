import { sprinkler } from '../../data/items.ts'
import { carrotSeed } from '../../data/crops/carrot.ts'

import {
  computePlayerInventory,
  getFieldToolInventory,
  getPlantableCropInventory,
} from './Farmhand.tsx'

vitest.mock('../../data/maps.ts')
vitest.mock('../../data/items.ts')

describe('private helpers', () => {
  describe('computePlayerInventory', () => {
    const inventory = [{ quantity: 1, id: 'carrot-seed' }]

    test('computes inventory with no value adjustments', () => {
      const playerInventory = computePlayerInventory(inventory, {})

      expect(playerInventory).toEqual([{ quantity: 1, ...carrotSeed }])
    })

    test('computes inventory with value adjustments', () => {
      const playerInventory = computePlayerInventory(inventory, {
        'carrot-seed': 2,
      })

      expect(playerInventory).toEqual([
        { ...carrotSeed, quantity: 1, value: 30 },
      ])
    })
  })

  describe('getFieldToolInventory', () => {
    test('selects field tools from inventory', () => {
      const fieldToolInventory = getFieldToolInventory([
        { ...sprinkler, quantity: 1 },
        { ...carrotSeed, quantity: 1 },
      ])

      expect(fieldToolInventory).toEqual([{ ...sprinkler, quantity: 1 }])
    })
  })

  describe('getPlantableCropInventory', () => {
    test('selects plantable crop items from inventory', () => {
      const inventory = [
        { id: 'carrot-seed', quantity: 1 },
        { id: 'weed', quantity: 1 },
      ]
      const plantableCropInventory = getPlantableCropInventory(inventory)

      expect(plantableCropInventory).toEqual([{ ...carrotSeed, quantity: 1 }])
    })
  })
})
