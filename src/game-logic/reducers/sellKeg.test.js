/**
 * @typedef {import("../../index").farmhand.keg} keg
 */
import { LOAN_GARNISHMENT_RATE } from '../../constants'
import { carrot } from '../../data/crops'
import { LOAN_PAYOFF } from '../../templates'
import { castToMoney } from '../../utils'
import { getKegValue } from '../../utils/getKegValue'

import { sellKeg } from './sellKeg'

/** @type keg */
const stubKeg = { id: 'stub-keg', daysUntilMature: -4, itemId: carrot.id }

const stubKegValue = getKegValue(stubKeg)

describe('sellKeg', () => {
  test('updates inventory', () => {
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
    })
  })

  test('updates sales records', () => {
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
      cellarItemsSold: { carrot: 1 },
      itemsSold: { carrot: 1 },
      pendingPeerMessages: [
        {
          id: 'abc123',
          message: 'sold one unit of Fermented Carrot.',
          severity: 'warning',
        },
      ],
    })
  })

  test('applies achievement bonus', () => {
    const state = sellKeg(
      {
        id: 'abc123',
        cellarInventory: [stubKeg],
        cellarItemsSold: {},
        completedAchievements: { 'i-am-rich-1': true },
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

    const adjustedKegValue = stubKegValue * 1.05

    expect(state).toMatchObject({
      loanBalance: castToMoney(500 - stubKegValue * LOAN_GARNISHMENT_RATE),
      money: castToMoney(
        1000 + adjustedKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
      ),
      revenue: castToMoney(
        adjustedKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
      ),
      todaysRevenue: castToMoney(
        adjustedKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
      ),
    })
  })

  test('updates learnedRecipes', () => {
    const state = sellKeg(
      {
        id: 'abc123',
        cellarInventory: [stubKeg],
        cellarItemsSold: {},
        completedAchievements: {},
        itemsSold: { carrot: 9 },
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
      learnedRecipes: { 'carrot-soup': true },
      itemsSold: { carrot: 10 },
    })
  })

  describe('there is an outstanding loan', () => {
    describe('loan is greater than garnishment', () => {
      test('sale is garnished', () => {
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
          loanBalance: castToMoney(500 - stubKegValue * LOAN_GARNISHMENT_RATE),
          money: castToMoney(
            1000 + stubKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
          ),
          revenue: castToMoney(
            stubKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
          ),
          todaysRevenue: castToMoney(
            stubKegValue - stubKegValue * LOAN_GARNISHMENT_RATE
          ),
        })
      })
    })

    describe('loan is less than garnishment', () => {
      test('loan is payed off', () => {
        const state = sellKeg(
          {
            id: 'abc123',
            cellarInventory: [stubKeg],
            cellarItemsSold: {},
            completedAchievements: {},
            itemsSold: {},
            learnedRecipes: {},
            loanBalance: 1,
            money: 1000,
            pendingPeerMessages: [],
            revenue: 0,
            todaysRevenue: 0,
            todaysNotifications: [],
          },
          stubKeg
        )

        expect(state).toMatchObject({
          loanBalance: 0,
        })
      })

      test('sale is reduced by remaining loan balance', () => {
        const state = sellKeg(
          {
            id: 'abc123',
            cellarInventory: [stubKeg],
            cellarItemsSold: {},
            completedAchievements: {},
            itemsSold: {},
            learnedRecipes: {},
            loanBalance: 1,
            money: 1000,
            pendingPeerMessages: [],
            revenue: 0,
            todaysRevenue: 0,
            todaysNotifications: [],
          },
          stubKeg
        )

        expect(state).toMatchObject({
          money: castToMoney(1000 + stubKegValue - 1),
          revenue: castToMoney(stubKegValue - 1),
          todaysRevenue: castToMoney(stubKegValue - 1),
        })
      })

      test('payoff notification is shown', () => {
        const state = sellKeg(
          {
            id: 'abc123',
            cellarInventory: [stubKeg],
            cellarItemsSold: {},
            completedAchievements: {},
            itemsSold: {},
            learnedRecipes: {},
            loanBalance: 1,
            money: 1000,
            pendingPeerMessages: [],
            revenue: 0,
            todaysRevenue: 0,
            todaysNotifications: [],
          },
          stubKeg
        )

        expect(state).toMatchObject({
          todaysNotifications: [
            { message: LOAN_PAYOFF``, severity: 'success' },
          ],
        })
      })
    })
  })

  describe('there is not an outstanding loan', () => {
    test('sale is not garnished', () => {
      const state = sellKeg(
        {
          id: 'abc123',
          cellarInventory: [stubKeg],
          cellarItemsSold: {},
          completedAchievements: {},
          itemsSold: {},
          learnedRecipes: {},
          loanBalance: 0,
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
        loanBalance: 0,
        money: castToMoney(1000 + stubKegValue),
        revenue: castToMoney(stubKegValue),
        todaysRevenue: castToMoney(stubKegValue),
      })
    })
  })
})
