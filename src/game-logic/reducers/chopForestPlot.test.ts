import { testState } from '../../test-utils/index.js'
import { toolLevel, toolType } from '../../enums.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { chopForestPlot } from './chopForestPlot.js'

vitest.mock('../../data/items.js')

const toolLevelsWithAxe = (level: farmhand.toolLevel) => ({
  [toolType.AXE]: level,
  [toolType.HOE]: toolLevel.DEFAULT,
  [toolType.PICKER_POLE]: toolLevel.DEFAULT,
  [toolType.SCYTHE]: toolLevel.DEFAULT,
  [toolType.SHOVEL]: toolLevel.DEFAULT,
  [toolType.WATERING_CAN]: toolLevel.DEFAULT,
})

// sample-tree-1's treeTimeline is [1, 2] (GROWN from daysOld 3) with a
// lifespan of 100 (DEAD from daysOld 103), and fruitTimeline is [1, 1]
// (fruit GROWN from daysSinceLastHarvest 2).
describe('chopForestPlot', () => {
  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(0)
  })

  describe('empty plot', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [[null]],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
      })

      const state = chopForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('axe is unavailable', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [
          [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 2 }],
        ],
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        toolLevels: toolLevelsWithAxe(toolLevel.UNAVAILABLE),
      })

      const state = chopForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('non-tree plot content', () => {
    test('no-ops', () => {
      const inputState = testState({
        forest: [[{ forageableId: 'mushroom', daysOld: 0 }]],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
      })

      const state = chopForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
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
        toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
      })

      const state = chopForestPlot(inputState, 0, 0)

      expect(state).toEqual(inputState)
    })
  })

  describe('grown tree with ripe fruit', () => {
    test('harvests the fruit as a bonus, adds wood, and clears the plot', () => {
      const { forest, inventory } = chopForestPlot(
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
          toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
        }),
        0,
        0
      )

      expect(inventory).toEqual([
        { id: 'sample-tree-1', quantity: 1 },
        { id: 'wood', quantity: 1 },
      ])
      expect(forest[0][0]).toBeNull()
    })
  })

  describe('grown tree, fruit not yet ripe', () => {
    test('adds wood without any fruit, and clears the plot', () => {
      const { forest, inventory } = chopForestPlot(
        testState({
          forest: [
            [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'wood', quantity: 1 }])
      expect(forest[0][0]).toBeNull()
    })
  })

  describe('immature tree', () => {
    test('yields a halved wood range and no fruit', () => {
      vitest.mocked(Math.random).mockReturnValue(0.999)

      const { forest, inventory } = chopForestPlot(
        testState({
          forest: [
            [{ itemId: 'sample-tree-1', daysOld: 0, daysSinceLastHarvest: 0 }],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          // DEFAULT axe tier's full range is [1, 2], so an immature tree's
          // halved range is [1, 1].
          toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'wood', quantity: 1 }])
      expect(forest[0][0]).toBeNull()
    })
  })

  describe('dead tree', () => {
    test('yields the full (not halved) wood range and no fruit bonus, even with ripe-looking fruit', () => {
      const { forest, inventory } = chopForestPlot(
        testState({
          forest: [
            [
              {
                itemId: 'sample-tree-1',
                // Past growthDuration + lifespan (3 + 100 = 103) - dead.
                daysOld: 103,
                // Would read as ripe (GROWN) fruit if the tree were alive.
                daysSinceLastHarvest: 2,
              },
            ],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          // DEFAULT axe tier's full range is [1, 2]; a dead tree gets the
          // full range, not the halved immature-tree range of [1, 1].
          toolLevels: toolLevelsWithAxe(toolLevel.DEFAULT),
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'wood', quantity: 1 }])
      expect(forest[0][0]).toBeNull()
    })

    test('rolls the full range up to its maximum, distinguishing it from a halved range', () => {
      vitest.mocked(Math.random).mockReturnValue(0.999)

      const { inventory } = chopForestPlot(
        testState({
          forest: [
            [
              {
                itemId: 'sample-tree-1',
                daysOld: 103,
                daysSinceLastHarvest: 0,
              },
            ],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsWithAxe(toolLevel.GOLD),
        }),
        0,
        0
      )

      // GOLD tier's full range is [8, 10]; a halved range would cap at 5.
      expect(inventory).toEqual([{ id: 'wood', quantity: 10 }])
    })
  })

  describe('wood yield range per axe tier', () => {
    test('rolls the minimum of the tier range when random() is 0', () => {
      vitest.mocked(Math.random).mockReturnValue(0)

      const { inventory } = chopForestPlot(
        testState({
          forest: [
            [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsWithAxe(toolLevel.GOLD),
        }),
        0,
        0
      )

      // GOLD tier's range is [8, 10].
      expect(inventory).toEqual([{ id: 'wood', quantity: 8 }])
    })

    test('rolls close to the maximum of the tier range when random() is just under 1', () => {
      vitest.mocked(Math.random).mockReturnValue(0.999)

      const { inventory } = chopForestPlot(
        testState({
          forest: [
            [{ itemId: 'sample-tree-1', daysOld: 3, daysSinceLastHarvest: 0 }],
          ],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsWithAxe(toolLevel.GOLD),
        }),
        0,
        0
      )

      // GOLD tier's range is [8, 10].
      expect(inventory).toEqual([{ id: 'wood', quantity: 10 }])
    })
  })
})
