import { testCrop } from '../../test-utils'
import { fertilizerType, toolType, toolLevel } from '../../enums'
import { getPlotContentFromItemId } from '../../utils'

import { INFINITE_STORAGE_LIMIT } from '../../constants'

import { harvestPlot } from './harvestPlot'

jest.mock('../../data/maps')

describe('harvestPlot', () => {
  const toolLevelsDefault = {
    [toolType.SCYTHE]: toolLevel.DEFAULT,
  }

  const toolLevelsBronze = {
    [toolType.SCYTHE]: toolLevel.BRONZE,
  }

  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const inputState = {
        cropsHarvested: {},
        field: [[getPlotContentFromItemId('sprinkler')]],
        inventory: [],
        toolLevels: toolLevelsDefault,
      }
      const state = harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('unripe crops', () => {
    test('no-ops', () => {
      const inputState = {
        cropsHarvested: {},
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
        inventory: [],
        toolLevels: toolLevelsDefault,
      }
      const state = harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('ripe crops', () => {
    test('harvests the plot', () => {
      const { cropsHarvested, field, inventory } = harvestPlot(
        {
          cropsHarvested: {},
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsDefault,
        },
        0,
        0
      )

      expect(field[0][0]).toBe(null)
      expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 1 }])
      expect(cropsHarvested).toEqual({ SAMPLE_CROP_TYPE_1: 1 })
    })

    describe('bronze scythe', () => {
      let farmhandState

      beforeEach(() => {
        farmhandState = {
          cropsHarvested: {},
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          toolLevels: toolLevelsBronze,
        }
      })

      test('harvests the plot', () => {
        const { field } = harvestPlot(farmhandState, 0, 0)

        expect(field[0][0]).toBe(null)
      })

      test('harvests 2 crops', () => {
        const { cropsHarvested, inventory } = harvestPlot(farmhandState, 0, 0)

        expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 2 }])
        expect(cropsHarvested).toEqual({ SAMPLE_CROP_TYPE_1: 2 })
      })
    })

    describe('there is insufficient inventory space', () => {
      test('no-ops', () => {
        const inputState = {
          cropsHarvested: {},
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [{ id: 'sample-crop-1', quantity: 5 }],
          inventoryLimit: 5,
          toolLevels: toolLevelsDefault,
        }
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
          {
            cropsHarvested: {},
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
            inventory: [{ id: 'sample-crop-seeds-1', quantity: 2 }],
            inventoryLimit: INFINITE_STORAGE_LIMIT,
            itemsSold: {},
          },
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
          {
            cropsHarvested: {},
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
            itemsSold: {},
          },
          0,
          0
        )

        expect(plotContent).toEqual(null)
      })
    })
  })
})
