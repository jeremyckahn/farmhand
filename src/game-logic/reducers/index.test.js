import { shapeOf, testCrop, testItem } from '../../test-utils'
import {
  ACHIEVEMENT_COMPLETED,
  LOAN_INCREASED,
  LOAN_PAYOFF,
  PRICE_CRASH,
  PRICE_SURGE,
} from '../../templates'
import {
  COW_GESTATION_PERIOD_DAYS,
  COW_HUG_BENEFIT,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_LATEST_PEER_MESSAGES,
  MAX_PENDING_PEER_MESSAGES,
  PURCHASEABLE_COMBINES,
  PURCHASEABLE_COW_PENS,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants'
import { huggingMachine, sampleCropItem1 } from '../../data/items'
import { sampleRecipe1 } from '../../data/recipes'
import { genders, standardCowColors } from '../../enums'
import {
  generateCow,
  getCostOfNextStorageExpansion,
  getCowValue,
  getPlotContentFromItemId,
  getPriceEventForCrop,
} from '../../utils'

import * as fn from './'

jest.mock('../../data/achievements')
jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))
jest.mock('../../data/recipes')
jest.mock('../../data/shop-inventory')
jest.mock('../../utils/isRandomNumberLessThan')

jest.mock('../../constants', () => ({
  __esModule: true,
  ...jest.requireActual('../../constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  PRECIPITATION_CHANCE: 0,
}))

describe('generatePriceEvents', () => {
  describe('price event already exists', () => {
    test('no-ops', () => {
      jest.spyOn(Math, 'random').mockReturnValue(1)
      const inputState = {
        newDayNotifications: [],
        priceCrashes: {
          [sampleCropItem1.id]: {
            itemId: sampleCropItem1.id,
            daysRemaining: 1,
          },
        },
        priceSurges: {},
      }
      const { priceCrashes, priceSurges } = fn.generatePriceEvents(inputState)

      expect(priceCrashes).toEqual(inputState.priceCrashes)
      expect(priceSurges).toEqual(inputState.priceSurges)
    })
  })

  describe('price event does not already exist', () => {
    let state

    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)

      jest.resetModules()
      jest.mock('../../data/levels', () => ({
        levels: [
          {
            id: 0,
          },
          {
            id: 1,
            unlocksShopItem: 'sample-crop-seeds-1',
          },
        ],
        itemUnlockLevels: {},
      }))
      const { generatePriceEvents } = jest.requireActual('./')
      state = generatePriceEvents({
        newDayNotifications: [],
        priceCrashes: {},
        priceSurges: {},
        itemsSold: { 'sample-crop-1': Infinity },
      })
    })

    test('generates a price event', () => {
      const priceEvents = {
        [sampleCropItem1.id]: getPriceEventForCrop(sampleCropItem1),
      }

      expect(state).toContainAnyEntries([
        ['priceCrashes', priceEvents],
        ['priceSurges', priceEvents],
      ])
    })

    test('shows notification', () => {
      expect(state.newDayNotifications).toIncludeAnyMembers([
        {
          message: PRICE_CRASH`${sampleCropItem1}`,
          severity: 'warning',
        },
        {
          message: PRICE_SURGE`${sampleCropItem1}`,
          severity: 'success',
        },
      ])
    })
  })
})

describe('updatePriceEvents', () => {
  test('updates price events', () => {
    const { priceCrashes, priceSurges } = fn.updatePriceEvents({
      priceCrashes: {
        'sample-crop-1': { itemId: 'sample-crop-1', daysRemaining: 1 },
        'sample-crop-2': { itemId: 'sample-crop-2', daysRemaining: 3 },
      },
      priceSurges: {
        'sample-crop-3': { itemId: 'sample-crop-3', daysRemaining: 5 },
      },
    })

    expect(priceCrashes).toEqual({
      'sample-crop-2': { itemId: 'sample-crop-2', daysRemaining: 2 },
    })

    expect(priceSurges).toEqual({
      'sample-crop-3': { itemId: 'sample-crop-3', daysRemaining: 4 },
    })
  })
})

describe('updateFinancialRecords', () => {
  test('updates financial records', () => {
    const {
      historicalDailyLosses,
      historicalDailyRevenue,
      profitabilityStreak,
      record7dayProfitAverage,
      recordProfitabilityStreak,
      recordSingleDayProfit,
      todaysLosses,
      todaysRevenue,
    } = fn.updateFinancialRecords({
      historicalDailyLosses: [],
      historicalDailyRevenue: [],
      profitabilityStreak: 0,
      record7dayProfitAverage: 0,
      recordProfitabilityStreak: 0,
      recordSingleDayProfit: 0,
      todaysLosses: -10,
      todaysRevenue: 15,
    })

    expect(historicalDailyLosses).toEqual([-10])
    expect(historicalDailyRevenue).toEqual([15])
    expect(record7dayProfitAverage).toEqual(5 / 7)
    expect(recordSingleDayProfit).toEqual(5)
    expect(profitabilityStreak).toEqual(1)
    expect(recordProfitabilityStreak).toEqual(1)
    expect(todaysLosses).toEqual(0)
    expect(todaysRevenue).toEqual(0)
  })

  test('truncates logs', () => {
    const {
      historicalDailyLosses,
      historicalDailyRevenue,
    } = fn.updateFinancialRecords({
      historicalDailyLosses: [-1, -2, -3, -4, -5, -6, -7],
      historicalDailyRevenue: [1, 2, 3, 4, 5, 6, 7],
      todaysLosses: -5,
      todaysRevenue: 10,
    })

    expect(historicalDailyLosses).toEqual([-5, -1, -2, -3, -4, -5, -6])
    expect(historicalDailyRevenue).toEqual([10, 1, 2, 3, 4, 5, 6])
  })

  describe('profitabilityStreak', () => {
    test('unprofitable day resets streak', () => {
      const {
        profitabilityStreak,
        recordProfitabilityStreak,
      } = fn.updateFinancialRecords({
        historicalDailyLosses: [],
        historicalDailyRevenue: [],
        profitabilityStreak: 10,
        record7dayProfitAverage: 0,
        recordProfitabilityStreak: 10,
        todaysLosses: -10,
        todaysRevenue: 10,
      })

      expect(profitabilityStreak).toEqual(0)
      expect(recordProfitabilityStreak).toEqual(10)
    })
  })
})

describe('updateInventoryRecordsForNextDay', () => {
  test('records inventory records for next day', () => {
    const {
      todaysPurchases,
      todaysStartingInventory,
    } = fn.updateInventoryRecordsForNextDay({
      inventory: [
        { id: 'sample-item-1', quantity: 2 },
        { id: 'sample-item-2', quantity: 5 },
      ],
      todaysPurchases: {
        'sample-item-3': 3,
      },
    })

    expect(todaysPurchases).toEqual({})
    expect(todaysStartingInventory).toEqual({
      'sample-item-1': 2,
      'sample-item-2': 5,
    })
  })
})

describe('applyLoanInterest', () => {
  test('applies loan interest', () => {
    expect(
      fn.applyLoanInterest({ loanBalance: 100, newDayNotifications: [] })
        .loanBalance
    ).toEqual(102)
  })
})

describe('computeStateForNextDay', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.75)
  })

  test('computes state for next day', () => {
    const {
      cowForSale,
      dayCount,
      field: [firstRow],
      valueAdjustments,
      todaysNotifications,
    } = fn.computeStateForNextDay({
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      dayCount: 1,
      field: [
        [
          testCrop({
            itemId: 'sample-crop-1',
            wasWateredToday: true,
          }),
        ],
      ],
      cowInventory: [],
      historicalDailyLosses: [],
      historicalDailyRevenue: [],
      inventory: [],
      itemsSold: {},
      loanBalance: 0,
      newDayNotifications: [],
      notificationLog: [],
      priceCrashes: {},
      priceSurges: {},
      profitabilityStreak: 0,
      record7dayProfitAverage: 0,
      recordProfitabilityStreak: 0,
      todaysNotifications: [{ message: 'some message', severity: 'info' }],
    })

    expect(shapeOf(cowForSale)).toEqual(shapeOf(generateCow()))
    expect(dayCount).toEqual(2)
    expect(valueAdjustments['sample-crop-1']).toEqual(1.25)
    expect(valueAdjustments['sample-crop-2']).toEqual(1.25)
    expect(firstRow[0].wasWateredToday).toBe(false)
    expect(firstRow[0].daysWatered).toBe(1)
    expect(firstRow[0].daysOld).toBe(1)
    expect(todaysNotifications).toBeEmpty()
  })
})

describe('purchaseItem', () => {
  describe('howMany === 0', () => {
    test('no-ops', () => {
      expect(
        fn.purchaseItem(
          {
            inventory: [],
            inventoryLimit: -1,
            money: 0,
            todaysPurchases: {},
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          0
        )
      ).toMatchObject({ inventory: [] })
    })
  })

  describe('user does not have enough money', () => {
    test('no-ops', () => {
      expect(
        fn.purchaseItem(
          {
            inventory: [],
            inventoryLimit: -1,
            money: 0,
            todaysPurchases: {},
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          1
        )
      ).toMatchObject({ inventory: [] })
    })
  })

  describe('user has enough money', () => {
    test('purchases item', () => {
      expect(
        fn.purchaseItem(
          {
            inventory: [],
            inventoryLimit: -1,
            money: 10,
            pendingPeerMessages: [],
            todaysPurchases: {},
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          2
        )
      ).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
        todaysPurchases: { 'sample-item-1': 2 },
        money: 8,
      })
    })

    describe('there is no room for any of the items being purchased', () => {
      test('no items are purchased', () => {
        expect(
          fn.purchaseItem(
            {
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
              money: 10,
              pendingPeerMessages: [],
              todaysPurchases: {},
              valueAdjustments: { 'sample-item-1': 1 },
            },
            { id: 'sample-item-1' },
            1
          )
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: {},
          money: 10,
        })
      })
    })

    describe('there is only room for some of the items being purchased', () => {
      test('a reduced amount of items are purchased', () => {
        expect(
          fn.purchaseItem(
            {
              inventory: [{ id: 'sample-item-1', quantity: 2 }],
              inventoryLimit: 3,
              money: 10,
              pendingPeerMessages: [],
              todaysPurchases: {},
              valueAdjustments: { 'sample-item-1': 1 },
            },
            { id: 'sample-item-1' },
            10
          )
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          todaysPurchases: { 'sample-item-1': 1 },
          money: 9,
        })
      })
    })
  })
})

describe('updateLearnedRecipes', () => {
  describe('recipe condition is not met', () => {
    test('recipe is not in the returned map', () => {
      const { learnedRecipes } = fn.updateLearnedRecipes({
        itemsSold: {},
      })

      expect(learnedRecipes['sample-recipe-1']).toBe(undefined)
    })
  })

  describe('recipe condition is met', () => {
    test('recipe is in the returned map', () => {
      const { learnedRecipes } = fn.updateLearnedRecipes({
        itemsSold: { 'sample-item-1': 3 },
      })

      expect(learnedRecipes['sample-recipe-1']).toEqual(true)
    })
  })
})

describe('makeRecipe', () => {
  describe('there are insufficient ingredients for recipe', () => {
    test('the recipe is not made', () => {
      const { inventory } = fn.makeRecipe(
        {
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
          inventoryLimit: -1,
        },
        sampleRecipe1
      )

      expect(inventory).toEqual([{ id: 'sample-item-1', quantity: 1 }])
    })
  })

  describe('there are sufficient ingredients for recipe', () => {
    test('consumes ingredients and adds recipe item to inventory', () => {
      const { inventory } = fn.makeRecipe(
        {
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
          inventoryLimit: -1,
        },
        sampleRecipe1
      )

      expect(inventory).toEqual([
        { id: 'sample-item-1', quantity: 1 },
        { id: 'sample-recipe-1', quantity: 1 },
      ])
    })
  })
})

describe('sellItem', () => {
  test('sells item', () => {
    const state = fn.sellItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(101)
    expect(state.revenue).toEqual(1)
    expect(state.todaysRevenue).toEqual(1)
    expect(state.itemsSold).toEqual({ 'sample-item-1': 1 })
  })

  test('updates learnedRecipes', () => {
    const { learnedRecipes } = fn.sellItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 3 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' }),
      3
    )

    expect(learnedRecipes['sample-recipe-1']).toBeTruthy()
  })

  describe('there is an outstanding loan', () => {
    let state

    describe('item is not a farm product', () => {
      test('sale is not garnished', () => {
        state = fn.sellItem(
          {
            inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 3 })],
            itemsSold: {},
            loanBalance: 100,
            money: 100,
            pendingPeerMessages: [],
            todaysNotifications: [],
            revenue: 0,
            todaysRevenue: 0,
            valueAdjustments: { 'sample-crop-seeds-1': 10 },
          },
          testItem({ id: 'sample-crop-seeds-1' }),
          3
        )

        expect(state.loanBalance).toEqual(100)
        expect(state.money).toEqual(130)
        expect(state.revenue).toEqual(30)
        expect(state.todaysRevenue).toEqual(30)
      })
    })

    describe('item is a farm product', () => {
      describe('loan is greater than garnishment', () => {
        test('sale is garnished', () => {
          state = fn.sellItem(
            {
              inventory: [testItem({ id: 'sample-crop-1', quantity: 3 })],
              itemsSold: {},
              loanBalance: 100,
              money: 100,
              pendingPeerMessages: [],
              todaysNotifications: [],
              revenue: 0,
              todaysRevenue: 0,
              valueAdjustments: { 'sample-crop-1': 10 },
            },
            testItem({ id: 'sample-crop-1' }),
            3
          )

          expect(state.loanBalance).toEqual(97)
          expect(state.money).toEqual(157)
          expect(state.revenue).toEqual(57)
          expect(state.todaysRevenue).toEqual(57)
        })
      })

      describe('loan is less than garnishment', () => {
        beforeEach(() => {
          state = fn.sellItem(
            {
              inventory: [testItem({ id: 'sample-crop-1', quantity: 3 })],
              itemsSold: {},
              loanBalance: 1.5,
              money: 100,
              pendingPeerMessages: [],
              todaysNotifications: [],
              revenue: 0,
              todaysRevenue: 0,
              valueAdjustments: { 'sample-crop-1': 10 },
            },
            testItem({ id: 'sample-crop-1' }),
            3
          )
        })

        test('loan is payed off', () => {
          expect(state.loanBalance).toEqual(0)
        })

        test('sale is reduced based on remaining loan balance', () => {
          expect(state.money).toEqual(158.5)
          expect(state.todaysRevenue).toEqual(58.5)
        })

        test('payoff notification is shown', () => {
          expect(state.todaysNotifications).toEqual([
            { message: LOAN_PAYOFF``, severity: 'success' },
          ])
        })
      })
    })
  })
})

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

    const state = fn.purchaseCow(
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

      const { cowInventory, cowForSale, money } = fn.purchaseCow(
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
      const state = fn.purchaseCow(
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

describe('selectCow', () => {
  test('updates selectedCowId', () => {
    const { selectedCowId } = fn.selectCow({}, { id: 'abc' })
    expect(selectedCowId).toEqual('abc')
  })
})

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

      const { cowInventory, cowsSold, money, revenue } = fn.sellCow(
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
      const { cowInventory, cowsSold, money, revenue } = fn.sellCow(
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
      const { inventory } = fn.sellCow(
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

describe('changeCowAutomaticHugState', () => {
  describe('setting isUsingHuggingMachine to true', () => {
    test('sets isUsingHuggingMachine to true', () => {
      const cow = generateCow()
      const inputState = {
        cowInventory: [cow],
        inventory: [{ id: huggingMachine.id, quantity: 1 }],
        inventoryLimit: -1,
      }
      const {
        cowInventory: [{ isUsingHuggingMachine }],
        inventory,
      } = fn.changeCowAutomaticHugState(inputState, cow, true)

      expect(isUsingHuggingMachine).toEqual(true)
      expect(inventory).toEqual([])
    })

    describe('there are no hugging machines in inventory', () => {
      test('no-ops', () => {
        const cow = generateCow()
        const inputState = {
          cowInventory: [cow],
          inventory: [],
          inventoryLimit: -1,
        }
        const state = fn.changeCowAutomaticHugState(inputState, cow, true)

        expect(state).toBe(inputState)
      })
    })

    describe('isUsingHuggingMachine is already true', () => {
      test('no-ops', () => {
        const cow = generateCow({ isUsingHuggingMachine: true })
        const inputState = {
          cowInventory: [cow],
          inventory: [{ id: huggingMachine.id, quantity: 1 }],
          inventoryLimit: -1,
        }
        const state = fn.changeCowAutomaticHugState(inputState, cow, true)

        expect(state).toBe(inputState)
      })
    })
  })

  describe('setting isUsingHuggingMachine to false', () => {
    test('sets isUsingHuggingMachine to false', () => {
      const cow = generateCow({ isUsingHuggingMachine: true })
      const inputState = {
        cowInventory: [cow],
        inventory: [],
        inventoryLimit: -1,
      }
      const {
        cowInventory: [{ isUsingHuggingMachine }],
        inventory,
      } = fn.changeCowAutomaticHugState(inputState, cow, false)

      expect(isUsingHuggingMachine).toEqual(false)
      expect(inventory).toEqual([{ id: huggingMachine.id, quantity: 1 }])
    })
  })
})

describe('changeCowBreedingPenResident', () => {
  describe('doAdd === false', () => {
    describe('cow is not in breeding pen', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        }

        const state = fn.changeCowBreedingPenResident(
          inputState,
          generateCow({ id: 'cow-c' }),
          false
        )

        expect(state).toBe(inputState)
      })
    })

    describe('cow is in position 1', () => {
      test('cow is removed', () => {
        const state = fn.changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: 'cow-b',
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-a' }),
          false
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-b',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })

    describe('cow is in position 2', () => {
      test('cow is removed', () => {
        const state = fn.changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: 'cow-b',
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-b' }),
          false
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })
  })

  describe('doAdd === true', () => {
    describe('cow is in breeding pen', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        }

        const state = fn.changeCowBreedingPenResident(
          inputState,
          generateCow({ id: 'cow-a' }),
          true
        )

        expect(state).toBe(inputState)
      })
    })

    describe('breeding pen is full', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        }

        const state = fn.changeCowBreedingPenResident(
          inputState,
          generateCow({ id: 'cow-c' }),
          true
        )

        expect(state).toBe(inputState)
      })
    })

    describe('there are no cows in breeding pen', () => {
      test('cow is added to first slot', () => {
        const state = fn.changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: null,
              cowId2: null,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-a' }),
          true
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: null,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })

    describe('there is one cow in breeding pen', () => {
      test('cow is added to second slot', () => {
        const state = fn.changeCowBreedingPenResident(
          {
            cowBreedingPen: {
              cowId1: 'cow-a',
              cowId2: null,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
            },
          },
          generateCow({ id: 'cow-b' }),
          true
        )

        expect(state).toEqual({
          cowBreedingPen: {
            cowId1: 'cow-a',
            cowId2: 'cow-b',
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
        })
      })
    })
  })
})

describe('purchaseField', () => {
  test('updates purchasedField', () => {
    const { purchasedField } = fn.purchaseField({ purchasedField: 0 }, 0)
    expect(purchasedField).toEqual(0)
  })

  test('prevents repurchasing options', () => {
    const { purchasedField } = fn.purchaseField({ purchasedField: 2 }, 1)
    expect(purchasedField).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = fn.purchaseField({ money: 1500, field: [[]] }, 1)
    expect(money).toEqual(500)
  })

  describe('field expansion', () => {
    test('field expands without destroying existing data', () => {
      jest.resetModules()
      jest.mock('../../constants', () => ({
        PURCHASEABLE_FIELD_SIZES: new Map([
          [1, { columns: 3, rows: 4, price: 1000 }],
        ]),
      }))

      const { purchaseField } = jest.requireActual('./')

      const { field } = purchaseField(
        {
          field: [
            [testCrop(), null],
            [null, testCrop()],
          ],
        },
        1
      )
      expect(field).toEqual([
        [testCrop(), null, null],
        [null, testCrop(), null],
        [null, null, null],
        [null, null, null],
      ])
    })
  })
})

describe('waterPlot', () => {
  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const inputState = { field: [[getPlotContentFromItemId('sprinkler')]] }
      const state = fn.waterPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('crops', () => {
    test('sets wasWateredToday to true', () => {
      const { field } = fn.waterPlot(
        {
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
        },
        0,
        0
      )

      expect(field[0][0].wasWateredToday).toBe(true)
    })
  })
})

describe('purchaseCombine', () => {
  test('updates purchasedCombine', () => {
    const { purchasedCombine } = fn.purchaseCombine({}, 1)
    expect(purchasedCombine).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCombine } = fn.purchaseCombine({ purchasedCombine: 2 }, 1)
    expect(purchasedCombine).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = fn.purchaseCombine({ money: 500000 }, 1)
    expect(money).toEqual(PURCHASEABLE_COMBINES.get(1).price - 500000)
  })
})

describe('purchaseCowPen', () => {
  test('updates purchasedCowPen', () => {
    const { purchasedCowPen } = fn.purchaseCowPen({}, 1)
    expect(purchasedCowPen).toEqual(1)
  })

  test('prevents repurchasing options', () => {
    const { purchasedCowPen } = fn.purchaseCowPen({ purchasedCowPen: 2 }, 1)
    expect(purchasedCowPen).toEqual(2)
  })

  test('deducts money', () => {
    const { money } = fn.purchaseCowPen({ money: 1500 }, 1)
    expect(money).toEqual(PURCHASEABLE_COW_PENS.get(1).price - 1500)
  })
})

describe('purchaseStorageExpansion', () => {
  describe('player does not have enough money', () => {
    test('no-ops', () => {
      const inputState = {
        money: getCostOfNextStorageExpansion(100) - 1,
        inventoryLimit: 100,
      }

      const state = fn.purchaseStorageExpansion(inputState)
      expect(state).toEqual(inputState)
    })
  })

  describe('player has enough money', () => {
    test('increase storage is purchased', () => {
      const { inventoryLimit, money } = fn.purchaseStorageExpansion({
        inventoryLimit: 100,
        money: getCostOfNextStorageExpansion(100),
      })

      expect(inventoryLimit).toEqual(100 + STORAGE_EXPANSION_AMOUNT)
      expect(money).toEqual(0)
    })
  })
})

describe('hugCow', () => {
  describe('cow has not hit daily hug benefit limit', () => {
    test('increases cow happiness', () => {
      const cow = generateCow()
      const {
        cowInventory: [{ happiness, happinessBoostsToday }],
      } = fn.hugCow(
        {
          cowInventory: [cow],
        },
        cow.id
      )

      expect(happiness).toBe(COW_HUG_BENEFIT)
      expect(happinessBoostsToday).toBe(1)
    })

    describe('cow is at max happiness', () => {
      test('does not increase cow happiness', () => {
        const cow = generateCow({ happiness: 1 })
        const { cowInventory } = fn.hugCow(
          {
            cowInventory: [cow],
          },
          cow.id
        )

        expect(cowInventory[0].happiness).toBe(1)
      })
    })
  })

  describe('cow has hit daily hug benefit limit', () => {
    test('does not increase cow happiness', () => {
      const cow = generateCow({ happiness: 0.5, happinessBoostsToday: 3 })
      const {
        cowInventory: [{ happiness, happinessBoostsToday }],
      } = fn.hugCow(
        {
          cowInventory: [cow],
        },
        cow.id
      )

      expect(happiness).toBe(0.5)
      expect(happinessBoostsToday).toBe(3)
    })
  })
})

describe('offerCow', () => {
  test('makes specified cow available for trade', () => {
    const cowId = 'abc123'
    const { cowIdOfferedForTrade } = fn.offerCow({}, cowId)

    expect(cowIdOfferedForTrade).toEqual(cowId)
  })
})

describe('withdrawCow', () => {
  test('makes specified cow unavailable for trade', () => {
    const cowId = 'abc123'

    let { cowIdOfferedForTrade } = fn.withdrawCow(
      { cowIdOfferedForTrade: cowId },
      'some-other-cow'
    )

    expect(cowIdOfferedForTrade).toEqual(cowId)

    cowIdOfferedForTrade = fn.withdrawCow(
      { cowIdOfferedForTrade: cowId },
      cowId
    ).cowIdOfferedForTrade

    expect(cowIdOfferedForTrade).toEqual('')
  })
})

describe('changeCowName', () => {
  test('updates cow name', () => {
    const cow = generateCow()
    const { cowInventory } = fn.changeCowName(
      {
        cowInventory: [generateCow(), cow],
      },
      cow.id,
      'new name'
    )

    expect(cowInventory[1]).toEqual({
      ...cow,
      name: 'new name',
    })
  })

  test('restricts name length', () => {
    const cow = generateCow()
    const { cowInventory } = fn.changeCowName(
      {
        cowInventory: [cow],
      },
      cow.id,
      new Array(100).join('.')
    )

    expect(cowInventory[0].name).toHaveLength(MAX_ANIMAL_NAME_LENGTH)
  })
})

describe('updateAchievements', () => {
  let updateAchievements

  beforeAll(() => {
    jest.resetModules()
    jest.mock('../../data/achievements', () => [
      {
        id: 'test-achievement',
        name: 'Test Achievement',
        description: '',
        rewardDescription: '',
        condition: state => !state.conditionSatisfied,
        reward: state => ({ ...state, conditionSatisfied: true }),
      },
    ])

    updateAchievements = jest.requireActual('./').updateAchievements
  })

  describe('achievement was not previously met', () => {
    describe('condition is not met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: {},
          conditionSatisfied: true,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toBe(inputState)
      })
    })

    describe('condition is met', () => {
      test('updates state', () => {
        const inputState = {
          completedAchievements: {},
          conditionSatisfied: false,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toMatchObject({
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: true,
          todaysNotifications: [
            {
              message: ACHIEVEMENT_COMPLETED`${{
                name: 'Test Achievement',
                rewardDescription: '',
              }}`,
              severity: 'success',
            },
          ],
        })
      })
    })
  })

  describe('achievement was previously met', () => {
    describe('condition is not met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: true,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toBe(inputState)
      })
    })

    describe('condition is met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: false,
          todaysNotifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toBe(inputState)
      })
    })
  })
})

describe('adjustLoan', () => {
  test('updates state', () => {
    expect(
      fn.adjustLoan(
        { money: 100, loanBalance: 50, todaysNotifications: [] },
        -25
      )
    ).toEqual({
      money: 75,
      loanBalance: 25,
      todaysNotifications: [],
    })
  })

  describe('loan payoff', () => {
    test('shows appropriate notification', () => {
      const { loansTakenOut, todaysNotifications } = fn.adjustLoan(
        {
          money: 100,
          loanBalance: 50,
          loansTakenOut: 1,
          todaysNotifications: [],
        },
        -50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_PAYOFF``, severity: 'success' },
      ])

      expect(loansTakenOut).toEqual(1)
    })
  })

  describe('loan increase', () => {
    test('shows appropriate notification, updates state', () => {
      const { loansTakenOut, todaysNotifications } = fn.adjustLoan(
        {
          money: 100,
          loanBalance: 50,
          todaysNotifications: [],
          loansTakenOut: 1,
        },
        50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_INCREASED`${100}`, severity: 'info' },
      ])

      expect(loansTakenOut).toEqual(2)
    })
  })
})

describe('forRange', () => {
  test('calls given reducer on range of plots', () => {
    const { field } = fn.forRange(
      {
        field: [
          [
            testCrop({ itemId: 'sample-crop-1' }),
            testCrop({ itemId: 'sample-crop-1' }),
          ],
          [testCrop({ itemId: 'sample-crop-1' })],
          [],
          [],
          [testCrop({ itemId: 'sample-crop-1' })],
        ],
      },
      fn.waterPlot,
      1,
      1,
      1
    )

    expect(field[0][0].wasWateredToday).toBe(true)
    expect(field[0][1].wasWateredToday).toBe(true)
    expect(field[1][0].wasWateredToday).toBe(true)
    expect(field[4][0].wasWateredToday).toBe(false)
  })
})

describe('updatePeer', () => {
  test('updates peer data', () => {
    const { latestPeerMessages, peers } = fn.updatePeer(
      {
        latestPeerMessages: [],
        peers: { abc123: { foo: true } },
      },
      'abc123',
      { foo: false }
    )

    expect(latestPeerMessages).toEqual([])
    expect(peers).toEqual({ abc123: { foo: false } })
  })

  test('limits pendingPeerMessages', () => {
    const { latestPeerMessages } = fn.updatePeer(
      {
        latestPeerMessages: new Array(50).fill('message'),
        peers: { abc123: { foo: true } },
      },
      'abc123',
      { foo: false }
    )

    expect(latestPeerMessages).toHaveLength(MAX_LATEST_PEER_MESSAGES)
  })
})

describe('prependPendingPeerMessage', () => {
  test('prepends a message', () => {
    const { pendingPeerMessages } = fn.prependPendingPeerMessage(
      { id: 'abc123', pendingPeerMessages: [] },
      'hello world'
    )

    expect(pendingPeerMessages).toEqual([
      { id: 'abc123', message: 'hello world', severity: 'info' },
    ])
  })

  test('limits the amount of stored messages', () => {
    const { pendingPeerMessages } = fn.prependPendingPeerMessage(
      {
        id: 'abc123',
        pendingPeerMessages: new Array(50).fill({
          id: 'abc123',
          message: 'some other message',
          severity: 'info',
        }),
      },
      'hello world'
    )

    expect(pendingPeerMessages[0]).toEqual({
      id: 'abc123',
      message: 'hello world',
      severity: 'info',
    })

    expect(pendingPeerMessages).toHaveLength(MAX_PENDING_PEER_MESSAGES)
  })
})
