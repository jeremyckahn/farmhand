import { decrementItemFromInventory } from './decrementItemFromInventory.js'
import { testState } from "../../test-utils/testState.js";

describe('decrementItemFromInventory', () => {
  let updatedState: farmhand.state

  describe('item is not in inventory', () => {
    beforeEach(() => {
      updatedState = decrementItemFromInventory(
        testState({
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
        }),
        'nonexistent-item'
      )
    })

    test('no-ops', () => {
      expect(updatedState).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 1 }],
      })
    })
  })

  describe('item is in inventory', () => {
    describe('single instance of item in inventory', () => {
      beforeEach(() => {
        updatedState = decrementItemFromInventory(
          testState({
            inventory: [{ id: 'sample-item-1', quantity: 1 }],
          }),
          'sample-item-1'
        )
      })

      test('removes item from inventory', () => {
        expect(updatedState).toMatchObject({ inventory: [] })
      })
    })

    describe('multiple instances of item in inventory', () => {
      beforeEach(() => {
        updatedState = decrementItemFromInventory(
          testState({
            inventory: [{ id: 'sample-item-1', quantity: 2 }],
          }),
          'sample-item-1'
        )
      })

      test('decrements item', () => {
        expect(updatedState).toMatchObject({
          inventory: [
            {
              id: 'sample-item-1',
              quantity: 1,
            },
          ],
        })
      })
    })
  })
})
