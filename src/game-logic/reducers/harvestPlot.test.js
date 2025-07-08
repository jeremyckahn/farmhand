import { testCrop, testState } from '../../test-utils/index.js'
import { fertilizerType, toolType, toolLevel } from '../../enums.js'
import { getPlotContentFromItemId } from '../../utils/index.js'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { harvestPlot } from './harvestPlot.js'

vitest.mock('../../data/maps.js')

describe('harvestPlot', () => {
  const toolLevelsDefault = {
    [toolType.HOE]: toolLevel.DEFAULT,
    [toolType.SCYTHE]: toolLevel.DEFAULT,
    [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
    [toolType.WATERING_CAN]: toolLevel.DEFAULT,
  }

  const toolLevelsBronze = {
    [toolType.HOE]: toolLevel.DEFAULT,
    [toolType.SCYTHE]: toolLevel.BRONZE,
    [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
    [toolType.WATERING_CAN]: toolLevel.DEFAULT,
  }

  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const inputState = testState({
        field: [[getPlotContentFromItemId('sprinkler')]],
        toolLevels: toolLevelsDefault,
      })
      const state = harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('unripe crops', () => {
    test('no-ops', () => {
      const inputState = testState({
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
        toolLevels: toolLevelsDefault,
      })
      const state = harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('ripe crops', () => {
    test('harvests the plot', () => {
      const { cropsHarvested, field, inventory } = harvestPlot(
        testState({
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsDefault,
        }),
        0,
        0
      )

      expect(field[0][0]).toBe(null)
      expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 1 }])
      expect(cropsHarvested).toEqual({
        ...testState().cropsHarvested,
        SAMPLE_CROP_TYPE_1: 1,
      })
    })

    describe('bronze scythe', () => {
      let farmhandState

      beforeEach(() => {
        farmhandState = testState({
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsBronze,
        })
      })

      test('harvests the plot', () => {
        const { field } = harvestPlot(farmhandState, 0, 0)

        expect(field[0][0]).toBe(null)
      })

      test('harvests 2 crops', () => {
        const { cropsHarvested, inventory } = harvestPlot(farmhandState, 0, 0)

        expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 2 }])
        expect(cropsHarvested).toEqual({
          ...testState().cropsHarvested,
          SAMPLE_CROP_TYPE_1: 2,
        })
      })
    })

    describe('there is insufficient inventory space', () => {
      test('no-ops', () => {
        const inputState = testState({
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [{ id: 'sample-crop-1', quantity: 5 }],
          inventoryLimit: 5,
          toolLevels: toolLevelsDefault,
        })
        const state = harvestPlot(inputState, 0, 0)

        expect(state).toEqual(inputState)
      })
    })
  })

  describe('plot is rainbow fertilized', () => {
    describe('more seeds remain in inventory', () => {
      test('seed is consumed to replant plot', () => {
        const {
          field: [[plotContent]],
          inventory: [{ quantity }],
        } = harvestPlot(
          testState({
            toolLevels: toolLevelsDefault,
            field: [
              [
                testCrop({
                  daysOld: 10,
                  itemId: 'sample-crop-1',
                  daysWatered: 4,
                  fertilizerType: fertilizerType.RAINBOW,
                }),
              ],
            ],
            inventory: [{ id: 'sample-crop-1-seed', quantity: 2 }],
            inventoryLimit: INFINITE_STORAGE_LIMIT,
          }),
          0,
          0
        )

        expect(plotContent).toEqual(
          testCrop({
            itemId: 'sample-crop-1',
            daysOld: 0,
            fertilizerType: fertilizerType.RAINBOW,
          })
        )
        expect(quantity).toEqual(1)
      })
    })

    describe('no more seeds remain in inventory', () => {
      test('plot is cleared', () => {
        const {
          field: [[plotContent]],
        } = harvestPlot(
          testState({
            toolLevels: toolLevelsDefault,
            field: [
              [
                testCrop({
                  daysOld: 10,
                  itemId: 'sample-crop-1',
                  daysWatered: 4,
                  fertilizerType: fertilizerType.RAINBOW,
                }),
              ],
            ],
            inventory: [],
            inventoryLimit: INFINITE_STORAGE_LIMIT,
          }),
          0,
          0
        )

        expect(plotContent).toEqual(null)
      })
    })
  })

  describe('weed', () => {
    let harvest

    beforeEach(() => {
      harvest = harvestPlot(
        testState({
          field: [[testCrop({ itemId: 'weed' })]],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsDefault,
        }),
        0,
        0
      )
    })

    test('it harvests the plot', () => {
      expect(harvest.field[0][0]).toBe(null)
    })

    test('it added the weed to the inventory', () => {
      expect(harvest.inventory).toEqual([{ id: 'weed', quantity: 1 }])
    })

    test('it did not alter cropsHarvested', () => {
      expect(harvest.cropsHarvested).toEqual(testState().cropsHarvested)
    })
  })
})
