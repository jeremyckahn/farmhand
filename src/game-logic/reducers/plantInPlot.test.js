import { testItem } from '../../test-utils/index.js'
import { getCropFromItemId } from '../../utils/index.js'

import { plantInPlot } from './plantInPlot.js'

vitest.mock('../../data/items.js')

describe('plantInPlot', () => {
  describe('crop quantity > 1', () => {
    describe('plot is empty', () => {
      test('plants the crop', () => {
        const state = plantInPlot(
          {
            field: [[]],
            inventory: [testItem({ id: 'sample-crop-1-seed', quantity: 2 })],
            itemsSold: {},
            selectedItemId: 'sample-crop-1-seed',
          },
          0,
          0,
          'sample-crop-1-seed'
        )

        expect(state.field[0][0]).toEqual(getCropFromItemId('sample-crop-1'))

        expect(state.inventory[0].quantity).toEqual(1)
      })
    })

    describe('plot is not empty', () => {
      test('does not decrement crop quantity', () => {
        const state = plantInPlot(
          {
            field: [[getCropFromItemId('sample-crop-1-seed')]],
            inventory: [testItem({ id: 'sample-crop-1-seed', quantity: 2 })],
            selectedItemId: 'sample-crop-1-seed',
          },
          0,
          0,
          'sample-crop-1-seed'
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
          inventory: [testItem({ id: 'sample-crop-1-seed', quantity: 1 })],
          itemsSold: {},
          selectedItemId: 'sample-crop-1-seed',
        },
        0,
        0,
        'sample-crop-1-seed'
      )

      expect(state.selectedItemId).toEqual('')
    })
  })

  describe('crop is not in inventory', () => {
    test('no-ops', () => {
      const inputState = {
        field: [[]],
        inventory: [],
        selectedItemId: 'sample-crop-1-seed',
      }
      const state = plantInPlot(inputState, 0, 0, 'sample-crop-1-seed')

      expect(inputState).toEqual(state)
    })
  })

  describe('crops with varieties', () => {
    test('plants a crop from a seed with varieties', () => {
      vitest.spyOn(Math, 'random').mockReturnValue(0)
      const state = plantInPlot(
        {
          field: [[]],
          inventory: [testItem({ id: 'grape-seed', quantity: 1 })],
          itemsSold: {},
          selectedItemId: 'grape-seed',
        },
        0,
        0,
        'grape-seed'
      )

      expect(state.field[0][0]).toEqual(getCropFromItemId('grape-chardonnay'))
    })
  })
})
