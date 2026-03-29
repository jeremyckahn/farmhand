import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { testItem, testState } from '../../test-utils/index.js'

import { purchaseItem } from './purchaseItem.js'

vitest.mock('../../data/maps.js')

describe('purchaseItem', () => {
  /** @type {farmhand.state} */
  let state

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
        purchaseItem(state, testItem({ id: 'sample-item-1' }), 0)
      ).toMatchObject({
        inventory: [],
      })
    })
  })

  describe('user does not have enough money', () => {
    test('no-ops', () => {
      state.money = 0
      expect(
        purchaseItem(state, testItem({ id: 'sample-item-1' }), 1)
      ).toMatchObject({
        inventory: [],
      })
    })
  })

  describe('user has enough money', () => {
    test('purchases item', () => {
      expect(
        purchaseItem(state, testItem({ id: 'sample-item-1' }), 2)
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
          purchaseItem(state, testItem({ id: 'sample-item-1' }), 1)
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
          purchaseItem(state, testItem({ id: 'sample-item-1' }), 10)
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: { 'sample-item-1': 1 },
          money: 9,
        })
      })
    })
  })
})
