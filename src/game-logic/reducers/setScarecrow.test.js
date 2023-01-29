import { testCrop, testItem } from '../../test-utils'
import { SCARECROW_ITEM_ID } from '../../constants'
import { fieldMode } from '../../enums'
import { getPlotContentFromItemId } from '../../utils'

import { setScarecrow } from './setScarecrow'

describe('setScarecrow', () => {
  let state

  beforeEach(() => {
    state = {
      field: [[null]],
      fieldMode: fieldMode.SET_SCARECROW,
      inventory: [testItem({ playerId: 'scarecrow', quantity: 1 })],
      selectedItemId: SCARECROW_ITEM_ID,
    }
  })

  describe('plot is not empty', () => {
    test('does nothing', () => {
      const inputState = { ...state, field: [[testCrop()]] }
      state = setScarecrow(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('plot is empty', () => {
    test('sets scarecrow', () => {
      const { inventory, field } = setScarecrow(state, 0, 0)
      expect(inventory).toHaveLength(0)
      expect(field[0][0]).toEqual(getPlotContentFromItemId('scarecrow'))
    })

    describe('multiple scarecrow units remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = setScarecrow(
          { ...state, inventory: [testItem({ playerId: 'scarecrow', quantity: 2 })] },
          0,
          0
        )

        expect(newFieldMode).toBe(fieldMode.SET_SCARECROW)
        expect(selectedItemId).toBe(SCARECROW_ITEM_ID)
      })
    })

    describe('one scarecrow unit remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = setScarecrow(
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
