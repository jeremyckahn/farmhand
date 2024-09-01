import { FERTILIZERS_PRODUCED } from '../../templates.js'
import {
  COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
  INFINITE_STORAGE_LIMIT,
} from '../../constants.js'
import { genders, standardCowColors } from '../../enums.js'
import { generateCow, getCowFertilizerItem } from '../../utils/index.js'

import { processCowFertilizerProduction } from './processCowFertilizerProduction.js'

describe('processCowFertilizerProduction', () => {
  let state

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
      newDayNotifications: [],
    }
  })

  describe('cow should not produce fertilizer', () => {
    test('cow does not produce fertilizer', () => {
      const baseDaysSinceProducingFertilizer = 2

      state.cowInventory = [
        generateCow({
          daysSinceProducingFertilizer: baseDaysSinceProducingFertilizer,
          gender: genders.MALE,
        }),
      ]

      const {
        cowInventory: [{ daysSinceProducingFertilizer }],
        inventory,
        newDayNotifications,
      } = processCowFertilizerProduction(state)

      expect(daysSinceProducingFertilizer).toEqual(
        baseDaysSinceProducingFertilizer
      )
      expect(inventory).toEqual([])
      expect(newDayNotifications).toEqual([])
    })
  })

  describe('cow should produce fertilizer', () => {
    describe('inventory space is available', () => {
      test('cow produces fertilizer and fertilizer is added to inventory', () => {
        state.cowInventory = [
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceProducingFertilizer: COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
            gender: genders.MALE,
          }),
        ]

        const {
          cowInventory: [cow],
          inventory,
          newDayNotifications,
        } = processCowFertilizerProduction(state)

        const { daysSinceProducingFertilizer } = cow

        expect(daysSinceProducingFertilizer).toEqual(0)
        expect(inventory).toEqual([{ id: 'fertilizer', quantity: 1 }])
        expect(newDayNotifications).toEqual([
          {
            message: FERTILIZERS_PRODUCED`${{
              [getCowFertilizerItem(cow).name]: 1,
            }}`,
            severity: 'success',
          },
        ])
      })
    })

    describe('inventory space is not available', () => {
      test('cow produces fertilizer but fertilizer is not added to inventory', () => {
        state.inventoryLimit = 1
        state.cowInventory = [
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceProducingFertilizer: COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
            gender: genders.MALE,
          }),
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceProducingFertilizer: COW_FERTILIZER_PRODUCTION_RATE_SLOWEST,
            gender: genders.MALE,
          }),
        ]

        const {
          cowInventory: [cow],
          inventory,
          newDayNotifications,
        } = processCowFertilizerProduction(state)

        const { daysSinceProducingFertilizer } = cow

        expect(daysSinceProducingFertilizer).toEqual(0)
        expect(inventory).toEqual([{ id: 'fertilizer', quantity: 1 }])
        expect(newDayNotifications).toEqual([
          {
            message: FERTILIZERS_PRODUCED`${{
              [getCowFertilizerItem(cow).name]: 1,
            }}`,
            severity: 'success',
          },
        ])
      })
    })
  })
})
