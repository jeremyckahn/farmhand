import { SCARECROW_ITEM_ID } from '../../constants.js'
import { fieldMode } from '../../enums.js'

import { testCrop } from '../../test-utils/testCrop.js'
import { testItem } from '../../test-utils/testItem.js'
import { getPlotContentFromItemId } from '../../utils/getPlotContentFromItemId.js'
import { testState } from '../../test-utils/testState.js'

import { setScarecrow } from './setScarecrow.js'

describe('setScarecrow', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      field: [[null]],
      fieldMode: fieldMode.SET_SCARECROW,
      inventory: [{ id: 'scarecrow', quantity: 1 }],
      selectedItemId: SCARECROW_ITEM_ID,
    })
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
          { ...state, inventory: [{ id: 'scarecrow', quantity: 2 }] },
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
