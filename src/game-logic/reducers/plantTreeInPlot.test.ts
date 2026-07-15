import { testState } from '../../test-utils/index.js'

import { plantTreeInPlot } from './plantTreeInPlot.js'

vitest.mock('../../data/items.js')

describe('plantTreeInPlot', () => {
  describe('plot is empty', () => {
    test('plants the tree', () => {
      // sample-tree-1's lifespan is 100 (src/data/__mocks__/items.ts). A
      // roll of 0 throughout means no early-death shortfall and an
      // immediately-beaten extension roll, landing on exactly 100.
      vitest.spyOn(Math, 'random').mockReturnValue(0)

      const state = plantTreeInPlot(
        testState({
          forest: [[null]],
          inventory: [{ id: 'sample-tree-1-sapling', quantity: 2 }],
        }),
        0,
        0,
        'sample-tree-1-sapling'
      )

      expect(state.forest[0][0]).toEqual({
        itemId: 'sample-tree-1',
        daysOld: 0,
        daysSinceLastHarvest: 0,
        daysGrown: 0,
        fertilizerType: 'NONE',
        lifespan: 100,
      })
    })

    test('rolls a randomized lifespan around the species default', () => {
      // First call: floor roll (max variance -> 100 * 0.95 = 95). Next two
      // calls: extension survives day 0 (0.06 >= 0.05) then is beaten on
      // day 1 (0.06 < 0.07), landing on a 1-day extension - 95 + 1 = 96.
      vitest
        .spyOn(Math, 'random')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(0.06)
        .mockReturnValueOnce(0.06)

      const state = plantTreeInPlot(
        testState({
          forest: [[null]],
          inventory: [{ id: 'sample-tree-1-sapling', quantity: 2 }],
        }),
        0,
        0,
        'sample-tree-1-sapling'
      )

      expect((state.forest[0][0] as farmhand.plantedTree).lifespan).toBe(96)
    })

    test('decrements the sapling from inventory', () => {
      const state = plantTreeInPlot(
        testState({
          forest: [[null]],
          inventory: [{ id: 'sample-tree-1-sapling', quantity: 2 }],
        }),
        0,
        0,
        'sample-tree-1-sapling'
      )

      expect(state.inventory[0].quantity).toEqual(1)
    })
  })

  describe('sapling quantity > 1', () => {
    test('keeps the sapling selected', () => {
      const state = plantTreeInPlot(
        testState({
          forest: [[null]],
          inventory: [{ id: 'sample-tree-1-sapling', quantity: 2 }],
          selectedForestItemId: 'sample-tree-1-sapling',
        }),
        0,
        0,
        'sample-tree-1-sapling'
      )

      expect(state.selectedForestItemId).toEqual('sample-tree-1-sapling')
    })
  })

  describe('sapling quantity === 1', () => {
    test('resets selectedForestItemId state', () => {
      const state = plantTreeInPlot(
        testState({
          forest: [[null]],
          inventory: [{ id: 'sample-tree-1-sapling', quantity: 1 }],
          selectedForestItemId: 'sample-tree-1-sapling',
        }),
        0,
        0,
        'sample-tree-1-sapling'
      )

      expect(state.selectedForestItemId).toEqual('')
    })
  })

  describe('plot is not empty', () => {
    test('does not plant or decrement inventory', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
        ],
        inventory: [{ id: 'sample-tree-1-sapling', quantity: 1 }],
      })

      const state = plantTreeInPlot(inputState, 0, 0, 'sample-tree-1-sapling')

      expect(state).toEqual(inputState)
    })
  })

  describe('sapling is not in inventory', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [[null]],
        inventory: [],
      })

      const state = plantTreeInPlot(inputState, 0, 0, 'sample-tree-1-sapling')

      expect(state).toEqual(inputState)
    })
  })
})
