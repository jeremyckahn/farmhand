import { testCrop } from '../../test-utils'
import { toolType, toolLevel } from '../../enums'
import { getPlotContentFromItemId, isRandomNumberLessThan } from '../../utils'

import { INFINITE_STORAGE_LIMIT } from '../../constants'

import { clearPlot } from './clearPlot'

jest.mock('../../data/maps')
jest.mock('../../utils/isRandomNumberLessThan')

describe('clearPlot', () => {
  describe('plotContent is a crop', () => {
    test('clears the plot', () => {
      const { field } = clearPlot(
        {
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          toolLevels: { [toolType.HOE]: toolLevel.DEFAULT },
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        },
        0,
        0
      )

      expect(field[0][0]).toBe(null)
    })

    describe('there is no room in the inventory', () => {
      test('clears the plot', () => {
        const { field, inventory } = clearPlot(
          {
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            toolLevels: { [toolType.HOE]: toolLevel.DEFAULT },
            inventory: [{ id: 'sample-item-1', quantity: 5 }],
            inventoryLimit: 5,
          },
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
        {
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 3 })]],
          toolLevels: { [toolType.HOE]: toolLevel.DEFAULT },
          inventory: [],
          inventoryLimit: 10,
        },
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
        {
          field: [[getPlotContentFromItemId('replantable-item')]],
          toolLevels: { [toolType.HOE]: toolLevel.DEFAULT },
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        },
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'replantable-item', quantity: 1 }])
      expect(field[0][0]).toBe(null)
    })

    describe('there is no room in the inventory', () => {
      test('no-ops', () => {
        const inputState = {
          field: [[getPlotContentFromItemId('replantable-item')]],
          toolLevels: { [toolType.HOE]: toolLevel.DEFAULT },
          inventory: [{ id: 'sample-item-1', quantity: 5 }],
          inventoryLimit: 5,
        }
        const state = clearPlot(inputState, 0, 0)

        expect(state).toEqual(inputState)
      })
    })
  })

  describe('plotContent is a weed', () => {
    test('weed is pulled', () => {
      const { field, inventory } = clearPlot(
        {
          field: [[getPlotContentFromItemId('weed')]],
          toolLevels: { [toolType.HOE]: toolLevel.DEFAULT },
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
        },
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'weed', quantity: 1 }])
      expect(field[0][0]).toBe(null)
    })
  })

  describe('hoe upgrades', () => {
    beforeEach(() => {
      isRandomNumberLessThan.mockReturnValue(true)
    })

    describe('crop is not fully grown', () => {
      test('returns seed to inventory', () => {
        const { field, inventory } = clearPlot(
          {
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            toolLevels: { [toolType.HOE]: toolLevel.BRONZE },
            inventory: [],
            inventoryLimit: 10,
          },
          0,
          0
        )

        expect(field[0][0]).toBe(null)
        expect(inventory).toEqual([{ id: 'sample-crop-1-seed', quantity: 1 }])
      })
    })
  })
})
