/**
 * @typedef {import("../../index").farmhand.keg} keg
 */
import { LOAN_GARNISHMENT_RATE } from '../../constants'
import { carrot } from '../../data/crops'
import { castToMoney } from '../../utils'
import { getKegValue } from '../../utils/getKegValue'

import { sellKeg } from './sellKeg'

/** @type keg */
const stubKeg = { id: 'stub-keg', daysUntilMature: 4, itemId: carrot.id }

const stubKegValue = getKegValue(stubKeg)

describe('sellKeg', () => {
  test('sells keg', () => {
    const state = sellKeg(
      {
        id: 'abc123',
        cellarInventory: [stubKeg],
        cellarItemsSold: {},
        completedAchievements: {},
        itemsSold: {},
        learnedRecipes: {},
        loanBalance: 500,
        money: 1000,
        pendingPeerMessages: [],
        revenue: 0,
        todaysRevenue: 0,
      },
      stubKeg
    )

    expect(state).toMatchObject({
      cellarInventory: [],
      cellarItemsSold: { carrot: 1 },
      completedAchievements: {},
      itemsSold: { carrot: 1 },
      learnedRecipes: {},
      loanBalance: castToMoney(500 - stubKegValue * LOAN_GARNISHMENT_RATE),
      money: castToMoney(
        1000 + stubKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
      ),
      pendingPeerMessages: [
        {
          id: 'abc123',
          message: 'sold one unit of Fermented Carrot.',
          severity: 'warning',
        },
      ],
      revenue: castToMoney(stubKegValue - stubKegValue * LOAN_GARNISHMENT_RATE),
      todaysRevenue: castToMoney(
        stubKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
      ),
    })
  })

  test('applies achievement bonus', () => {
    // FIXME: Implement this
  })

  test('updates learnedRecipes', () => {
    // FIXME: Implement this
  })

  describe('there is an outstanding loan', () => {
    describe('loan is greater than garnishment', () => {
      test('sale is garnished', () => {
        // FIXME: Implement this
      })
    })

    describe('loan is less than garnishment', () => {
      test('loan is payed off', () => {
        // FIXME: Implement this
      })

      test('sale is reduced based on remaining loan balance', () => {
        // FIXME: Implement this
      })

      test('payoff notification is shown', () => {
        // FIXME: Implement this
      })
    })
  })

  describe('there is not an outstanding loan', () => {
    test('sale is not garnished', () => {
      // FIXME: Implement this
    })
  })
})
