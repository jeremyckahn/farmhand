import { testState } from '../../test-utils/index.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { harvestForestPlot } from './harvestForestPlot.js'

vitest.mock('../../data/items.js')

// sample-tree-1's treeTimeline is [1, 2] (GROWN from daysOld 3) and
// fruitTimeline is [1, 1] (fruit GROWN from daysSinceLastHarvest 2).
describe('harvestForestPlot', () => {
  describe('empty plot', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [[null]],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      })

      const state = harvestForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('tree not yet grown', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 0, daysSinceLastHarvest: 0 }],
        ],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      })

      const state = harvestForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('tree grown but fruit not yet ripe', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
        ],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      })

      const state = harvestForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('fruit ripe', () => {
    test('adds fruit to inventory', () => {
      const { inventory } = harvestForestPlot(
        testState({
          forest: [
            [
              {
                itemId: 'sample-tree-1',
                daysOld: 3,
                daysSinceLastHarvest: 2,
              },
            ],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'sample-tree-1', quantity: 1 }])
    })

    test('resets only the fruit cycle, leaving the tree at its grown age', () => {
      const { forest } = harvestForestPlot(
        testState({
          forest: [
            [
              {
                itemId: 'sample-tree-1',
                daysOld: 3,
                daysSinceLastHarvest: 2,
              },
            ],
          ],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        0,
        0
      )

      expect(forest[0][0]).toEqual({
        itemId: 'sample-tree-1',
        daysOld: 3,
        daysSinceLastHarvest: 0,
      })
    })
  })

  describe('inventory is full', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 2 }],
        ],
        inventory: [],
        inventoryLimit: 0,
      })

      const state = harvestForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })
})
