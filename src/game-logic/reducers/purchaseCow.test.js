import { PURCHASEABLE_COW_PENS } from '../../constants'
import { genders, standardCowColors } from '../../enums'
import { generateCow, getCowValue } from '../../utils'

import { purchaseCow } from './purchaseCow'

describe('purchaseCow', () => {
  const cow = Object.freeze(
    generateCow({
      baseWeight: 1000,
      color: standardCowColors.WHITE,
      daysOld: 1,
      gender: genders.FEMALE,
      name: 'cow',
      weightMultiplier: 1,
    })
  )

  test('purchases a cow', () => {
    const playerId = 'abc123'
    const oldCowForSale = generateCow()

    const state = purchaseCow(
      {
        cowForSale: oldCowForSale,
        cowInventory: [],
        cowColorsPurchased: {},
        id: playerId,
        money: 5000,
        purchasedCowPen: 1,
      },
      cow
    )

    expect(state).toMatchObject({
      cowInventory: [{ ...cow, ownerId: playerId, originalOwnerId: playerId }],
      money: 5000 - getCowValue(cow, false),
    })

    expect(state.cowForSale).not.toBe(oldCowForSale)
    expect(state.cowColorsPurchased.WHITE).toEqual(1)
  })

  describe('is unsufficient room in cow pen', () => {
    test('cow is not purchased', () => {
      const oldCowForSale = generateCow()
      const cowCapacity = PURCHASEABLE_COW_PENS.get(1).cows

      const { cowInventory, cowForSale, money } = purchaseCow(
        {
          cowForSale: oldCowForSale,
          cowInventory: Array(cowCapacity)
            .fill(null)
            .map(() => generateCow()),
          cowColorsPurchased: {},
          money: 5000,
          purchasedCowPen: 1,
        },
        cow
      )

      expect(cowInventory).toHaveLength(cowCapacity)
      expect(cowForSale).toBe(oldCowForSale)
      expect(money).toBe(5000)
    })
  })

  describe('player does not have enough money', () => {
    const oldCowForSale = generateCow()

    test('cow is not purchased', () => {
      const state = purchaseCow(
        {
          cowForSale: oldCowForSale,
          cowInventory: [],
          cowColorsPurchased: {},
          money: 500,
          purchasedCowPen: 1,
        },
        cow
      )

      expect(state).toMatchObject({
        cowInventory: [],
        money: 500,
      })

      expect(state.cowForSale).toBe(oldCowForSale)
    })
  })
})
