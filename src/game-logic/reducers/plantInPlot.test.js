import { testItem } from '../../test-utils'
import { getCropFromItemId } from '../../utils'

import { plantInPlot } from './plantInPlot'

jest.mock('../../data/items')

describe('plantInPlot', () => {
  describe('crop quantity > 1', () => {
    describe('plot is empty', () => {
      test('plants the crop', () => {
        const state = plantInPlot(
          {
            field: [[]],
            inventory: [testItem({ playerId: 'sample-crop-seeds-1', quantity: 2 })],
            itemsSold: {},
            selectedItemId: 'sample-crop-seeds-1',
          },
          0,
          0,
          'sample-crop-seeds-1'
        )

        expect(state.field[0][0]).toEqual(getCropFromItemId('sample-crop-1'))

        expect(state.inventory[0].quantity).toEqual(1)
      })
    })

    describe('plot is not empty', () => {
      test('does not decrement crop quantity', () => {
        const state = plantInPlot(
          {
            field: [[getCropFromItemId('sample-crop-seeds-1')]],
            inventory: [testItem({ playerId: 'sample-crop-seeds-1', quantity: 2 })],
            selectedItemId: 'sample-crop-seeds-1',
          },
          0,
          0,
          'sample-crop-seeds-1'
        )

        expect(state.inventory[0].quantity).toEqual(2)
      })
    })
  })

  describe('crop quantity === 1', () => {
    test('resets selectedItemId state', () => {
      const state = plantInPlot(
        {
          field: [[]],
          inventory: [testItem({ playerId: 'sample-crop-seeds-1', quantity: 1 })],
          itemsSold: {},
          selectedItemId: 'sample-crop-seeds-1',
        },
        0,
        0,
        'sample-crop-seeds-1'
      )

      expect(state.selectedItemId).toEqual('')
    })
  })

  describe('crop is not in inventory', () => {
    test('no-ops', () => {
      const inputState = {
        field: [[]],
        inventory: [],
        selectedItemId: 'sample-crop-seeds-1',
      }
      const state = plantInPlot(inputState, 0, 0, 'sample-crop-seeds-1')

      expect(inputState).toEqual(state)
    })
  })
})
