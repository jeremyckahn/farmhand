import { testItem } from '../../test-utils/index.js'
import { LOAN_PAYOFF } from '../../templates.js'
import { carrot, carrotSeed } from '../../data/crops/index.js'
import { bronzeOre, coal, milk1, saltRock } from '../../data/items.js'
import { carrotSoup } from '../../data/recipes.js'

import { sellItem } from './sellItem.js'

describe('sellItem', () => {
  test('sells item', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: carrot.id, quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { [carrotSeed.id]: 1 },
      },
      testItem({ id: carrot.id })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(125)
    expect(state.revenue).toEqual(25)
    expect(state.todaysRevenue).toEqual(25)
    expect(state.itemsSold).toEqual({ carrot: 1 })
  })

  test('does not change revenue for seed sales', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: carrotSeed.id, quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { [carrotSeed.id]: 1 },
      },
      testItem({ id: carrotSeed.id })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(107.5)
    expect(state.revenue).toEqual(0)
    expect(state.todaysRevenue).toEqual(0)
    expect(state.itemsSold).toEqual({ [carrotSeed.id]: 1 })
  })

  test('applies achievement bonus to farm products', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: carrot.id, quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { [carrot.id]: 1 },
        completedAchievements: {
          'i-am-rich-3': true,
        },
      },
      testItem({ id: carrot.id })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(131.25)
    expect(state.revenue).toEqual(31.25)
    expect(state.todaysRevenue).toEqual(31.25)
    expect(state.itemsSold).toEqual({ [carrot.id]: 1 })
  })

  test('does not apply achievement bonus to seeds', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: carrotSeed.id, quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { [carrotSeed.id]: 1 },
        completedAchievements: {
          'i-am-rich-3': true,
        },
      },
      testItem({ id: carrotSeed.id })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(107.5)
    expect(state.revenue).toEqual(0)
    expect(state.todaysRevenue).toEqual(0)
    expect(state.itemsSold).toEqual({ [carrotSeed.id]: 1 })
  })

  test('updates learnedRecipes', () => {
    const { learnedRecipes } = sellItem(
      {
        inventory: [testItem({ id: carrot.id, quantity: 2 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { [carrot.id]: 1 },
      },
      testItem({ id: carrot.id }),
      15
    )

    expect(learnedRecipes[carrotSoup.id]).toBeTruthy()
  })

  describe('there is an outstanding loan', () => {
    let state

    describe('item is not a farm product', () => {
      beforeEach(() => {
        state = sellItem(
          {
            experience: 0,
            inventory: [testItem({ id: carrotSeed.id, quantity: 3 })],
            itemsSold: {},
            loanBalance: 100,
            money: 100,
            pendingPeerMessages: [],
            todaysNotifications: [],
            revenue: 0,
            todaysRevenue: 0,
            valueAdjustments: { [carrotSeed.id]: 1 },
          },
          testItem({ id: carrotSeed.id }),
          3
        )
      })

      test('sale is not garnished', () => {
        expect(state.loanBalance).toEqual(100)
        expect(state.money).toEqual(122.5)
        expect(state.revenue).toEqual(0)
        expect(state.todaysRevenue).toEqual(0)
      })

      test('experience is not gained', () => {
        expect(state.experience).toEqual(0)
      })
    })

    describe('item is a farm product', () => {
      describe('loan is greater than garnishment', () => {
        test('sale is garnished', () => {
          state = sellItem(
            {
              inventory: [testItem({ id: carrot.id, quantity: 3 })],
              itemsSold: {},
              loanBalance: 100,
              money: 100,
              pendingPeerMessages: [],
              todaysNotifications: [],
              revenue: 0,
              todaysRevenue: 0,
              valueAdjustments: { [carrot.id]: 1 },
            },
            testItem({ id: carrot.id }),
            3
          )

          expect(state.loanBalance).toEqual(96.25)
          expect(state.money).toEqual(171.25)
          expect(state.revenue).toEqual(71.25)
          expect(state.todaysRevenue).toEqual(71.25)
        })
      })

      describe('loan is less than garnishment', () => {
        beforeEach(() => {
          state = sellItem(
            {
              experience: 0,
              inventory: [testItem({ id: carrot.id, quantity: 3 })],
              itemsSold: {},
              loanBalance: 1.5,
              money: 100,
              pendingPeerMessages: [],
              todaysNotifications: [],
              revenue: 0,
              todaysRevenue: 0,
              valueAdjustments: { [carrot.id]: 1 },
            },
            testItem({ id: carrot.id }),
            3
          )
        })

        test('loan is payed off', () => {
          expect(state.loanBalance).toEqual(0)
        })

        test('sale is reduced based on remaining loan balance', () => {
          expect(state.money).toEqual(173.5)
          expect(state.todaysRevenue).toEqual(73.5)
        })

        test('payoff notification is shown', () => {
          expect(state.todaysNotifications).toEqual([
            // @ts-expect-error
            { message: LOAN_PAYOFF``, severity: 'success' },
          ])
        })

        test('experience is gained', () => {
          expect(state.experience).toEqual(3)
        })
      })
    })
  })

  const experienceTestArgs = [
    carrot,
    milk1,
    coal,
    carrotSoup,
    bronzeOre,
    saltRock,
  ].map(item => [item.type, item])

  test.each(experienceTestArgs)(
    'selling item of type %s gives experience',
    (_, item) => {
      const state = sellItem(
        {
          experience: 0,
          inventory: [testItem({ id: item.id, quantity: 1 })],
          itemsSold: {},
          loanBalance: 0,
          money: 100,
          pendingPeerMessages: [],
          todaysNotifications: [],
          revenue: 0,
          todaysRevenue: 0,
          valueAdjustments: { [item.id]: 1 },
        },
        testItem({ id: item.id }),
        1
      )

      expect(state.experience).toEqual(1)
    }
  )
})
