import { testCrop, testState } from '../../test-utils/index.js'
import { fertilizerType, fieldMode } from '../../enums.js'

import { setLightningRod } from './setLightningRod.js'

const LIGHTNING_ROD_ITEM_ID = 'sample-lightning-rod-1'

describe('setLightningRod', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      field: [[null]],
      fieldMode: fieldMode.SET_LIGHTNING_ROD,
      inventory: [{ id: LIGHTNING_ROD_ITEM_ID, quantity: 1 }],
      selectedItemId: LIGHTNING_ROD_ITEM_ID,
    })
  })

  describe('plot is not empty', () => {
    test('does nothing', () => {
      const inputState = { ...state, field: [[testCrop()]] }

      state = setLightningRod(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('plot is empty', () => {
    test('places the lightning rod with a fresh strike counter', () => {
      const { inventory, field } = setLightningRod(state, 0, 0)

      expect(inventory).toHaveLength(0)
      expect(field[0][0]).toEqual({
        itemId: LIGHTNING_ROD_ITEM_ID,
        fertilizerType: fertilizerType.NONE,
        lightningStrikesSustained: 0,
      })
    })

    describe('multiple lightning rod units remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = setLightningRod(
          { ...state, inventory: [{ id: LIGHTNING_ROD_ITEM_ID, quantity: 2 }] },
          0,
          0
        )

        expect(newFieldMode).toBe(fieldMode.SET_LIGHTNING_ROD)
        expect(selectedItemId).toBe(LIGHTNING_ROD_ITEM_ID)
      })
    })

    describe('one lightning rod unit remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = setLightningRod(
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
