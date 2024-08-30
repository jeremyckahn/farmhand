import { INFINITE_STORAGE_LIMIT } from '../../constants'

import { purchaseItem } from './purchaseItem'

vitest.mock('../../data/maps')

describe('purchaseItem', () => {
  describe('howMany === 0', () => {
    test('no-ops', () => {
      expect(
        purchaseItem(
          {
            inventory: [],
            inventoryLimit: INFINITE_STORAGE_LIMIT,
            money: 0,
            todaysPurchases: {},
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          0
        )
      ).toMatchObject({ inventory: [] })
    })
  })

  describe('user does not have enough money', () => {
    test('no-ops', () => {
      expect(
        purchaseItem(
          {
            inventory: [],
            inventoryLimit: INFINITE_STORAGE_LIMIT,
            money: 0,
            todaysPurchases: {},
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          1
        )
      ).toMatchObject({ inventory: [] })
    })
  })

  describe('user has enough money', () => {
    test('purchases item', () => {
      expect(
        purchaseItem(
          {
            inventory: [],
            inventoryLimit: INFINITE_STORAGE_LIMIT,
            money: 10,
            pendingPeerMessages: [],
            todaysPurchases: {},
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          2
        )
      ).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
        todaysPurchases: { 'sample-item-1': 2 },
        money: 8,
      })
    })

    describe('there is no room for any of the items being purchased', () => {
      test('no items are purchased', () => {
        expect(
          purchaseItem(
            {
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
              money: 10,
              pendingPeerMessages: [],
              todaysPurchases: {},
              valueAdjustments: { 'sample-item-1': 1 },
            },
            { id: 'sample-item-1' },
            1
          )
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: {},
          money: 10,
        })
      })
    })

    describe('there is only room for some of the items being purchased', () => {
      test('a reduced amount of items are purchased', () => {
        expect(
          purchaseItem(
            {
              inventory: [{ id: 'sample-item-1', quantity: 2 }],
              inventoryLimit: 3,
              money: 10,
              pendingPeerMessages: [],
              todaysPurchases: {},
              valueAdjustments: { 'sample-item-1': 1 },
            },
            { id: 'sample-item-1' },
            10
          )
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: { 'sample-item-1': 1 },
          money: 9,
        })
      })
    })
  })
})
