import { huggingMachine } from '../../data/items.js'
import { standardCowColors } from '../../enums.js'
import { getCowValue, generateCow } from '../../utils/index.js'
import { testState } from '../../test-utils/index.js'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

import { sellCow } from './sellCow.js'

describe('sellCow', () => {
  let cow

  beforeEach(() => {
    cow = generateCow({
      color: standardCowColors.BLUE,
      isBred: false,
    })
  })

  describe('cow is bred', () => {
    test('cow is sold as revenue', () => {
      cow = generateCow({
        color: standardCowColors.BLUE,
        isBred: true,
      })

      const { cowInventory, cowsSold, money, revenue } = sellCow(
        testState({
          cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
          cowInventory: [cow],
          cowsSold: {},
          money: 0,
          revenue: 0,
        }),
        cow
      )

      expect(cowInventory).not.toContain(cow)
      expect(cowsSold).toEqual({ 'blue-cow': 1 })
      expect(money).toEqual(getCowValue(cow, true))
      expect(revenue).toEqual(getCowValue(cow, true))
    })
  })

  describe('cow is not bred', () => {
    test('cow is sold', () => {
      const { cowInventory, cowsSold, money, revenue } = sellCow(
        testState({
          cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
          cowInventory: [cow],
          cowsSold: { 'blue-cow': 1 },
          money: 0,
          revenue: 0,
        }),
        cow
      )

      expect(cowInventory).not.toContain(cow)
      expect(cowsSold).toEqual({ 'blue-cow': 2 })
      expect(money).toEqual(getCowValue(cow, true))
      expect(revenue).toEqual(0)
    })
  })

  describe('cow has hugging machine', () => {
    test('returns hugging machine to inventory', () => {
      const cow = generateCow({
        isUsingHuggingMachine: true,
      })
      const { inventory } = sellCow(
        testState({
          cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
          cowInventory: [cow],
          cowsSold: {},
          inventory: [],
          inventoryLimit: INFINITE_STORAGE_LIMIT,
          money: 0,
        }),
        cow
      )

      expect(inventory).toEqual([{ id: huggingMachine.id, quantity: 1 }])
    })
  })
})
