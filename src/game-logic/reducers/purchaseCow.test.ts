import { vi } from 'vitest'

import { PURCHASEABLE_COW_PENS } from '../../constants.js'
import { genders, standardCowColors } from '../../enums.js'
import { testState } from '../../test-utils/index.js'
import * as generateCowModule from '../../utils/generateCow.js'
import { getCowValue } from '../../utils/getCowValue.js'

import { purchaseCow } from './purchaseCow.js'

describe('purchaseCow', () => {
  let state: farmhand.state
  const cow = Object.freeze(
    generateCowModule.generateCow({
      baseWeight: 1000,
      color: standardCowColors.WHITE,
      daysOld: 1,
      gender: genders.FEMALE,
      name: 'cow',
      weightMultiplier: 1,
    })
  )

  beforeEach(() => {
    state = testState({
      cowForSale: generateCowModule.generateCow(),
      cowInventory: [],
      playerId: 'abc123',
      money: 5000,
      purchasedCowPen: 1,
    })
    vi.spyOn(generateCowModule, 'generateCow').mockReturnValue(
      generateCowModule.generateCow()
    )
  })

  test('purchases a cow', () => {
    const newState = purchaseCow(state, cow)

    expect(newState).toMatchObject({
      cowInventory: [{ ...cow, ownerId: 'abc123', originalOwnerId: 'abc123' }],
      money: 5000 - getCowValue(cow, false),
    })

    expect(newState.cowForSale).not.toBe(state.cowForSale)
    expect(newState.cowColorsPurchased.WHITE).toEqual(1)
  })

  describe('is unsufficient room in cow pen', () => {
    test('cow is not purchased', () => {
      const cowCapacity = PURCHASEABLE_COW_PENS.get(1)?.cows || 0

      state.cowInventory = Array(cowCapacity)
        .fill(null)
        .map(() => generateCowModule.generateCow())

      const { cowInventory, cowForSale, money } = purchaseCow(state, cow)

      expect(cowInventory).toHaveLength(cowCapacity)
      expect(cowForSale).toBe(state.cowForSale)
      expect(money).toBe(5000)
    })
  })

  describe('player does not have enough money', () => {
    test('cow is not purchased', () => {
      state.money = 500
      const newState = purchaseCow(state, cow)

      expect(newState).toMatchObject({
        cowInventory: [],
        money: 500,
      })

      expect(newState.cowForSale).toBe(state.cowForSale)
    })
  })
})
