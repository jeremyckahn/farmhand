import { testItem } from '../../test-utils'

import { decrementItemFromInventory } from './decrementItemFromInventory'

describe('decrementItemFromInventory', () => {
  let updatedState

  describe('item is not in inventory', () => {
    beforeEach(() => {
      updatedState = decrementItemFromInventory(
        { inventory: [testItem({ id: 'sample-item-1', quantity: 1 })] },
        'nonexistent-item'
      )
    })

    test('no-ops', () => {
      expect(updatedState).toMatchObject({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
      })
    })
  })

  describe('item is in inventory', () => {
    describe('single instance of item in inventory', () => {
      beforeEach(() => {
        updatedState = decrementItemFromInventory(
          { inventory: [testItem({ id: 'sample-item-1', quantity: 1 })] },
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
          { inventory: [testItem({ id: 'sample-item-1', quantity: 2 })] },
          'sample-item-1'
        )
      })

      test('decrements item', () => {
        expect(updatedState).toMatchObject({
          inventory: [
            testItem({
              id: 'sample-item-1',
              quantity: 1,
            }),
          ],
        })
      })
    })
  })
})
