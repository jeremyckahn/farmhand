import { testCrop } from '../../test-utils/index.js'
import { toolType, toolLevel } from '../../enums.js'
import { getPlotContentFromItemId } from '../../utils/index.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { randomNumberService } from '../../common/services/randomNumber.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { clearPlot } from './clearPlot.js'

vitest.mock('../../data/maps.js')

const toolLevels = {
  [toolType.HOE]: toolLevel.DEFAULT,
  [toolType.SCYTHE]: toolLevel.UNAVAILABLE,
  [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
  [toolType.WATERING_CAN]: toolLevel.UNAVAILABLE,
}

describe('clearPlot', () => {
  describe('plotContent is a crop', () => {
    test('clears the plot', () => {
      const { field } = clearPlot(
        saveDataStubFactory({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          toolLevels,
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        0,
        0
      )

      expect(field[0][0]).toBe(null)
    })

    describe('there is no room in the inventory', () => {
      test('clears the plot', () => {
        const { field, inventory } = clearPlot(
          saveDataStubFactory({
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            toolLevels,
            inventory: [{ id: 'sample-item-1', quantity: 5 }],
            inventoryLimit: 5,
          }),
          0,
          0
        )

        expect(field[0][0]).toBe(null)
        expect(inventory).toEqual([{ id: 'sample-item-1', quantity: 5 }])
      })
    })
  })

  describe('crop is fully grown', () => {
    test('harvests crop', () => {
      const { field, inventory } = clearPlot(
        saveDataStubFactory({
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 3 })]],
          toolLevels,
          inventory: [],
          inventoryLimit: 10,
        }),
        0,
        0
      )

      expect(field[0][0]).toBe(null)
      expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 1 }])
    })
  })

  describe('plotContent is replantable', () => {
    test('updates state', () => {
      const { field, inventory } = clearPlot(
        saveDataStubFactory({
          field: [[getPlotContentFromItemId('replantable-item')]],
          toolLevels,
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'replantable-item', quantity: 1 }])
      expect(field[0][0]).toBe(null)
    })

    describe('there is no room in the inventory', () => {
      test('no-ops', () => {
        const inputState = saveDataStubFactory({
          field: [[getPlotContentFromItemId('replantable-item')]],
          toolLevels,
          inventory: [{ id: 'sample-item-1', quantity: 5 }],
          inventoryLimit: 5,
        })
        const state = clearPlot(inputState, 0, 0)

        expect(state).toEqual(inputState)
      })
    })
  })

  describe('plotContent is a weed', () => {
    test('weed is pulled', () => {
      const { field, inventory } = clearPlot(
        saveDataStubFactory({
          field: [[getPlotContentFromItemId('weed')]],
          toolLevels,
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        }),
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'weed', quantity: 1 }])
      expect(field[0][0]).toBe(null)
    })
  })

  describe('hoe upgrades', () => {
    beforeEach(() => {
      vitest
        .spyOn(randomNumberService, 'isRandomNumberLessThan')
        .mockReturnValue(true)
    })

    describe('crop is not fully grown', () => {
      test('returns seed to inventory', () => {
        const { field, inventory } = clearPlot(
          saveDataStubFactory({
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            toolLevels: { ...toolLevels, [toolType.HOE]: toolLevel.BRONZE },
            inventory: [],
            inventoryLimit: 10,
          }),
          0,
          0
        )

        expect(field[0][0]).toBe(null)
        expect(inventory).toEqual([{ id: 'sample-crop-1-seed', quantity: 1 }])
      })
    })
  })
})
