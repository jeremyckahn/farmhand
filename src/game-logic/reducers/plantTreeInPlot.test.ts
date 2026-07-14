import { testState } from '../../test-utils/index.js'

import { plantTreeInPlot } from './plantTreeInPlot.js'

vitest.mock('../../data/items.js')

describe('plantTreeInPlot', () => {
  describe('plot is empty', () => {
    test('plants the tree', () => {
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
      })
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
