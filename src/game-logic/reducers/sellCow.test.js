import { huggingMachine } from '../../data/items'
import { genders, standardCowColors } from '../../enums'
import { getCowValue } from '../../utils'

import { sellCow } from './sellCow'

describe('sellCow', () => {
  let cow

  beforeEach(() => {
    cow = Object.freeze({
      baseWeight: 1000,
      color: standardCowColors.BLUE,
      daysOld: 1,
      gender: genders.FEMALE,
      name: 'cow',
      isBred: false,
      weightMultiplier: 1,
    })
  })

  describe('cow is bred', () => {
    test('cow is sold as revenue', () => {
      cow = Object.freeze({
        baseWeight: 1000,
        color: standardCowColors.BLUE,
        daysOld: 1,
        gender: genders.FEMALE,
        name: 'cow',
        isBred: true,
        weightMultiplier: 1,
      })

      const { cowInventory, cowsSold, money, revenue } = sellCow(
        {
          cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
          cowInventory: [cow],
          cowsSold: {},
          money: 0,
          revenue: 0,
        },
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
        {
          cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
          cowInventory: [cow],
          cowsSold: { 'blue-cow': 1 },
          money: 0,
          revenue: 0,
        },
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
      const cow = Object.freeze({
        baseWeight: 1000,
        daysOld: 1,
        gender: genders.FEMALE,
        isUsingHuggingMachine: true,
        name: 'cow',
        weightMultiplier: 1,
      })
      const { inventory } = sellCow(
        {
          cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
          cowInventory: [cow],
          cowsSold: {},
          inventory: [],
          inventoryLimit: -1,
          money: 0,
        },
        cow
      )

      expect(inventory).toEqual([{ id: huggingMachine.id, quantity: 1 }])
    })
  })
})
