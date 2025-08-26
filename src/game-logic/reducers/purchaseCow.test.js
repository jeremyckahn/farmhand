import { vi } from 'vitest'

import { PURCHASEABLE_COW_PENS } from '../../constants.js'
import { genders, standardCowColors } from '../../enums.js'
import { testState } from '../../test-utils/index.js'
import * as utils from '../../utils/index.js'

import { purchaseCow } from './purchaseCow.js'

describe('purchaseCow', () => {
  /** @type {farmhand.state} */
  let state
  const cow = Object.freeze(
    utils.generateCow({
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
      cowForSale: utils.generateCow(),
      cowInventory: [],
      playerId: 'abc123',
      money: 5000,
      purchasedCowPen: 1,
    })
    vi.spyOn(utils, 'generateCow').mockReturnValue(utils.generateCow())
  })

  test('purchases a cow', () => {
    const newState = purchaseCow(state, cow)

    expect(newState).toMatchObject({
      cowInventory: [{ ...cow, ownerId: 'abc123', originalOwnerId: 'abc123' }],
      money: 5000 - utils.getCowValue(cow, false),
    })

    expect(newState.cowForSale).not.toBe(state.cowForSale)
    expect(newState.cowColorsPurchased.WHITE).toEqual(1)
  })

  describe('is unsufficient room in cow pen', () => {
    test('cow is not purchased', () => {
      const cowCapacity = PURCHASEABLE_COW_PENS.get(1)?.cows || 0
      state.cowInventory = Array(cowCapacity)
        .fill(null)
        .map(() => utils.generateCow())

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
