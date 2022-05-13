import { testCrop, testItem } from '../../test-utils'
import { SPRINKLER_ITEM_ID } from '../../constants'
import { fieldMode } from '../../enums'
import { getPlotContentFromItemId } from '../../utils'

import { setSprinkler } from './setSprinkler'

describe('setSprinkler', () => {
  let state

  beforeEach(() => {
    state = {
      field: [[null]],
      fieldMode: fieldMode.SET_SPRINKLER,
      inventory: [testItem({ id: 'sprinkler', quantity: 1 })],
      itemsSold: {},
      selectedItemId: SPRINKLER_ITEM_ID,
    }
  })

  describe('plot is not empty', () => {
    test('does nothing', () => {
      const inputState = { ...state, field: [[testCrop()]] }
      state = setSprinkler(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('plot is empty', () => {
    test('sets sprinkler', () => {
      const { field, inventory } = setSprinkler(state, 0, 0)

      expect(field[0][0]).toEqual(getPlotContentFromItemId('sprinkler'))
      expect(inventory).toHaveLength(0)
    })

    describe('multiple sprinkler units remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = setSprinkler(
          { ...state, inventory: [testItem({ id: 'sprinkler', quantity: 2 })] },
          0,
          0
        )
        expect(newFieldMode).toBe(fieldMode.SET_SPRINKLER)
        expect(selectedItemId).toBe(SPRINKLER_ITEM_ID)
      })
    })

    describe('one sprinkler unit remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = setSprinkler(
          state,
          0,
          0
        )

        expect(newFieldMode).toBe(fieldMode.OBSERVE)
        expect(selectedItemId).toBe('')
      })
    })
  })
})
