import { testState } from '../../test-utils/index.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { toolLevel } from '../../enums.js'

import { harvestForestPlot } from './harvestForestPlot.js'

vitest.mock('../../data/items.js')

const toolLevelsWithPickerPole = {
  AXE: toolLevel.UNAVAILABLE,
  HOE: toolLevel.DEFAULT,
  PICKER_POLE: toolLevel.DEFAULT,
  SCYTHE: toolLevel.DEFAULT,
  SHOVEL: toolLevel.UNAVAILABLE,
  WATERING_CAN: toolLevel.DEFAULT,
} as farmhand.state['toolLevels']

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
          toolLevels: toolLevelsWithPickerPole,
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'sample-tree-1', quantity: 1 }])
    })

    test('increments treeFruitsHarvested', () => {
      const { treeFruitsHarvested } = harvestForestPlot(
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
          toolLevels: toolLevelsWithPickerPole,
          treeFruitsHarvested: {},
        }),
        0,
        0
      )

      expect(treeFruitsHarvested).toEqual({ 'sample-tree-1': 1 })
    })

    test('increments treeFruitsHarvested by the picker pole fruit yield', () => {
      const { treeFruitsHarvested } = harvestForestPlot(
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
          toolLevels: {
            ...toolLevelsWithPickerPole,
            PICKER_POLE: toolLevel.GOLD,
          },
          treeFruitsHarvested: {},
        }),
        0,
        0
      )

      expect(treeFruitsHarvested).toEqual({ 'sample-tree-1': 5 })
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
          toolLevels: toolLevelsWithPickerPole,
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

    test('no-ops if the picker pole is not equipped', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 2 }],
        ],
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      })

      const state = harvestForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })

    test.each([
      [toolLevel.DEFAULT, 1],
      [toolLevel.BRONZE, 2],
      [toolLevel.IRON, 3],
      [toolLevel.SILVER, 4],
      [toolLevel.GOLD, 5],
    ])(
      'adds %s fruit yield tier as %i fruit to inventory',
      (pickerPoleLevel, expectedQuantity) => {
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
            toolLevels: {
              ...toolLevelsWithPickerPole,
              PICKER_POLE: pickerPoleLevel,
            },
          }),
          0,
          0
        )

        expect(inventory).toEqual([
          { id: 'sample-tree-1', quantity: expectedQuantity },
        ])
      }
    )
  })

  describe('inventory is full', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 2 }],
        ],
        inventory: [],
        inventoryLimit: 0,
        toolLevels: toolLevelsWithPickerPole,
      })

      const state = harvestForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('inventory has less space than the picker pole fruit yield', () => {
    test('increments treeFruitsHarvested by only the fruit that fit in the inventory', () => {
      const { inventory, treeFruitsHarvested } = harvestForestPlot(
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
          inventoryLimit: 1,
          toolLevels: {
            ...toolLevelsWithPickerPole,
            PICKER_POLE: toolLevel.GOLD,
          },
          treeFruitsHarvested: {},
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'sample-tree-1', quantity: 1 }])
      expect(treeFruitsHarvested).toEqual({ 'sample-tree-1': 1 })
    })
  })
})
