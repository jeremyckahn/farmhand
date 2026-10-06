import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { huggingMachine } from '../../data/items.js'
import { testItem, testState } from '../../test-utils/index.js'

import { purchaseItem } from './purchaseItem.js'

vitest.mock('../../data/maps.js')

describe('purchaseItem', () => {
  let state: farmhand.state

  beforeEach(() => {
    state = testState({
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
      money: 10,
      pendingPeerMessages: [],
      todaysPurchases: {},
      valueAdjustments: { 'sample-item-1': 1 },
    })
  })

  describe('howMany === 0', () => {
    test('no-ops', () => {
      state.money = 0
      expect(
        purchaseItem(state, testItem({ id: 'sample-item-1' }) as any, 0)
      ).toMatchObject({
        inventory: [],
      })
    })
  })

  describe('user does not have enough money', () => {
    test('no-ops', () => {
      state.money = 0
      expect(
        purchaseItem(state, testItem({ id: 'sample-item-1' }) as any, 1)
      ).toMatchObject({
        inventory: [],
      })
    })
  })

  describe('user has enough money', () => {
    test('purchases item', () => {
      expect(
        purchaseItem(state, testItem({ id: 'sample-item-1' }) as any, 2)
      ).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
        todaysPurchases: { 'sample-item-1': 2 },
        money: 8,
      })
    })

    describe('there is no room for any of the items being purchased', () => {
      test('no items are purchased', () => {
        state.inventory = [{ id: 'sample-item-1', quantity: 3 }]
        state.inventoryLimit = 3

        expect(
          purchaseItem(state, testItem({ id: 'sample-item-1' }) as any, 1)
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: {},
          money: 10,
        })
      })
    })

    describe('there is only room for some of the items being purchased', () => {
      test('a reduced amount of items are purchased', () => {
        state.inventory = [{ id: 'sample-item-1', quantity: 2 }]
        state.inventoryLimit = 3

        expect(
          purchaseItem(state, testItem({ id: 'sample-item-1' }) as any, 10)
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: { 'sample-item-1': 1 },
          money: 9,
        })
      })
    })

    test('respects an item maximum purchase quantity', () => {
      const item = testItem({
        id: 'sample-item-1',
        getMaxPurchaseQuantity: () => 2,
      })

      expect(purchaseItem(state, item, 5)).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
        todaysPurchases: { 'sample-item-1': 2 },
        money: 8,
      })
    })

    test('does not purchase when an item maximum is negative', () => {
      const item = testItem({
        id: 'sample-item-1',
        getMaxPurchaseQuantity: () => -2,
      })

      expect(purchaseItem(state, item, 1)).toMatchObject({
        inventory: [],
        todaysPurchases: {},
        money: 10,
      })
    })

    describe('the item has a maximum purchase quantity', () => {
      test.each([
        [1, 10],
        [2, 20],
        [3, 30],
      ])(
        'limits Hugging Machines to the Cow Pen capacity of %i cows',
        (purchasedCowPen, cowCapacity) => {
          state = testState({
            inventory: [],
            money: 10_000,
            purchasedCowPen,
            valueAdjustments: { [huggingMachine.id]: 1 },
          })

          expect(huggingMachine.getMaxPurchaseQuantity?.(state)).toEqual(
            cowCapacity
          )
        }
      )

      test('limits the purchase to the remaining Cow Pen capacity', () => {
        state = testState({
          inventory: [{ id: huggingMachine.id, quantity: 9 }],
          money: 10_000,
          purchasedCowPen: 1,
          valueAdjustments: { [huggingMachine.id]: 1 },
        })

        expect(purchaseItem(state, huggingMachine, 2)).toMatchObject({
          inventory: [{ id: huggingMachine.id, quantity: 10 }],
          todaysPurchases: { [huggingMachine.id]: 1 },
          money: 9_500,
          pendingPeerMessages: [
            { message: 'purchased 1 unit of Hugging Machine.' },
          ],
        })
      })

      test('does not purchase a Hugging Machine when capacity is full', () => {
        state = testState({
          inventory: [{ id: huggingMachine.id, quantity: 10 }],
          money: 10_000,
          purchasedCowPen: 1,
          valueAdjustments: { [huggingMachine.id]: 1 },
        })

        expect(purchaseItem(state, huggingMachine, 1)).toMatchObject({
          inventory: [{ id: huggingMachine.id, quantity: 10 }],
          todaysPurchases: {},
          money: 10_000,
        })
      })

      test('does not purchase a Hugging Machine when already over capacity', () => {
        state = testState({
          inventory: [{ id: huggingMachine.id, quantity: 11 }],
          money: 10_000,
          purchasedCowPen: 1,
          valueAdjustments: { [huggingMachine.id]: 1 },
        })

        expect(purchaseItem(state, huggingMachine, 1)).toMatchObject({
          inventory: [{ id: huggingMachine.id, quantity: 11 }],
          todaysPurchases: {},
          money: 10_000,
        })
      })

      test('does not purchase a Hugging Machine without a Cow Pen', () => {
        state = testState({
          money: 10_000,
          valueAdjustments: { [huggingMachine.id]: 1 },
        })

        expect(purchaseItem(state, huggingMachine, 1)).toMatchObject({
          inventory: [],
          todaysPurchases: {},
          money: 10_000,
        })
      })
    })
  })
})
