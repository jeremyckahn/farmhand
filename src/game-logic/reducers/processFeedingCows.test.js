import { OUT_OF_COW_FEED_NOTIFICATION } from '../../strings'
import {
  COW_FEED_ITEM_ID,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
} from '../../constants'

import { generateCow } from '../../utils'

import { processFeedingCows } from './processFeedingCows'

describe('processFeedingCows', () => {
  let state

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
    }
  })

  describe('player has no cow feed', () => {
    beforeEach(() => {
      state.cowInventory = [generateCow({ weightMultiplier: 1 })]
      state.newDayNotifications = []
    })

    test('cows weight goes down', () => {
      const {
        cowInventory: [{ weightMultiplier }],
        newDayNotifications,
      } = processFeedingCows(state)

      expect(weightMultiplier).toEqual(1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT)
      expect(newDayNotifications).toEqual([
        {
          message: OUT_OF_COW_FEED_NOTIFICATION,
          severity: 'error',
        },
      ])
    })
  })

  describe('player has cow feed', () => {
    beforeEach(() => {
      state.cowInventory = [
        generateCow({ weightMultiplier: 1 }),
        generateCow({ weightMultiplier: 1 }),
      ]
      state.newDayNotifications = []
    })

    describe('there are more feed units than cows to feed', () => {
      test('units are distributed to cows', () => {
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 4 }]
        const {
          cowInventory,
          inventory: [{ quantity }],
          newDayNotifications,
        } = processFeedingCows(state)

        expect(cowInventory[0].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(cowInventory[1].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(quantity).toEqual(2)
        expect(newDayNotifications).toEqual([])
      })
    })

    describe('there are more cows to feed than feed units', () => {
      test('units are distributed to cows and remainder goes hungry', () => {
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 1 }]
        const {
          cowInventory,
          inventory,
          newDayNotifications,
        } = processFeedingCows(state)

        expect(cowInventory[0].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(cowInventory[1].weightMultiplier).toEqual(
          1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(inventory).toHaveLength(0)
        expect(newDayNotifications).toEqual([
          {
            message: OUT_OF_COW_FEED_NOTIFICATION,
            severity: 'error',
          },
        ])
      })
    })

    describe('mixed set of weightMultipliers with unsufficient cow feed units', () => {
      test('units are distributed to cows and remainder goes hungry', () => {
        state.cowInventory = [
          generateCow({ weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM }),
          generateCow({ weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM }),
          generateCow({ weightMultiplier: 1 }),
          generateCow({ weightMultiplier: 1 }),
        ]
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 3 }]

        const { cowInventory, inventory } = processFeedingCows(state)

        expect(cowInventory[0].weightMultiplier).toEqual(
          COW_WEIGHT_MULTIPLIER_MAXIMUM
        )
        expect(cowInventory[1].weightMultiplier).toEqual(
          COW_WEIGHT_MULTIPLIER_MAXIMUM
        )
        expect(cowInventory[2].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(cowInventory[3].weightMultiplier).toEqual(
          1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(inventory).toHaveLength(0)
      })
    })
  })
})
