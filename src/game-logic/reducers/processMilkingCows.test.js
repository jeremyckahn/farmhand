import { MILKS_PRODUCED } from '../../templates'
import { COW_MILK_RATE_SLOWEST } from '../../constants'
import { genders, standardCowColors } from '../../enums'
import { generateCow, getCowMilkItem } from '../../utils'

import { processMilkingCows } from './processMilkingCows'

describe('processMilkingCows', () => {
  let state

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
      inventoryLimit: -1,
      newDayNotifications: [],
    }
  })

  describe('cow should not be milked', () => {
    test('cow is not milked', () => {
      const baseDaysSinceMilking = 2

      state.cowInventory = [
        generateCow({
          daysSinceMilking: baseDaysSinceMilking,
          gender: genders.FEMALE,
        }),
      ]

      const {
        cowInventory: [{ daysSinceMilking }],
        inventory,
        newDayNotifications,
      } = processMilkingCows(state)

      expect(daysSinceMilking).toEqual(baseDaysSinceMilking)
      expect(inventory).toEqual([])
      expect(newDayNotifications).toEqual([])
    })
  })

  describe('cow should be milked', () => {
    describe('inventory space is available', () => {
      test('cow is milked and milk is added to inventory', () => {
        state.cowInventory = [
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceMilking: COW_MILK_RATE_SLOWEST,
            gender: genders.FEMALE,
          }),
        ]

        const {
          cowInventory: [cow],
          inventory,
          newDayNotifications,
        } = processMilkingCows(state)

        const { daysSinceMilking } = cow

        expect(daysSinceMilking).toEqual(0)
        expect(inventory).toEqual([{ id: 'milk-1', quantity: 1 }])
        expect(newDayNotifications).toEqual([
          {
            message: MILKS_PRODUCED`${{ [getCowMilkItem(cow).name]: 1 }}`,
            severity: 'success',
          },
        ])
      })
    })

    describe('inventory space is not available', () => {
      test('cow is milked but milk is not added to inventory', () => {
        state.inventoryLimit = 1
        state.cowInventory = [
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceMilking: COW_MILK_RATE_SLOWEST,
            gender: genders.FEMALE,
          }),
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceMilking: COW_MILK_RATE_SLOWEST,
            gender: genders.FEMALE,
          }),
        ]

        const {
          cowInventory: [cow],
          inventory,
          newDayNotifications,
        } = processMilkingCows(state)

        const { daysSinceMilking } = cow

        expect(daysSinceMilking).toEqual(0)
        expect(inventory).toEqual([{ id: 'milk-1', quantity: 1 }])
        expect(newDayNotifications).toEqual([
          {
            message: MILKS_PRODUCED`${{ [getCowMilkItem(cow).name]: 1 }}`,
            severity: 'success',
          },
        ])
      })
    })
  })
})
