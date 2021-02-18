import { shapeOf, testCrop, testItem } from './test-utils'
import {
  RAIN_MESSAGE,
  STORM_MESSAGE,
  STORM_DESTROYS_SCARECROWS_MESSAGE,
} from './strings'
import {
  ACHIEVEMENT_COMPLETED,
  COW_ATTRITION_MESSAGE,
  CROW_ATTACKED,
  LEVEL_GAINED_NOTIFICATION,
  LOAN_INCREASED,
  LOAN_PAYOFF,
  MILKS_PRODUCED,
  PRICE_CRASH,
  PRICE_SURGE,
} from './templates'
import {
  COW_FEED_ITEM_ID,
  COW_GESTATION_PERIOD_DAYS,
  COW_HUG_BENEFIT,
  COW_MILK_RATE_SLOWEST,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  FERTILIZER_BONUS,
  FERTILIZER_ITEM_ID,
  MAX_ANIMAL_NAME_LENGTH,
  MAX_DAILY_COW_HUG_BENEFITS,
  NOTIFICATION_LOG_SIZE,
  PURCHASEABLE_COW_PENS,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
  STORAGE_EXPANSION_AMOUNT,
  STORAGE_EXPANSION_PRICE,
} from './constants'
import { huggingMachine, sampleCropItem1 } from './data/items'
import { sampleRecipe1 } from './data/recipes'
import { itemsMap } from './data/maps'
import { fieldMode, genders, standardCowColors } from './enums'
import {
  farmProductSalesVolumeNeededForLevel,
  generateCow,
  getCowMilkItem,
  getCowValue,
  getCropFromItemId,
  getPlotContentFromItemId,
  getPriceEventForCrop,
} from './utils'
import * as fn from './reducers'

jest.mock('localforage')
jest.mock('./data/achievements')
jest.mock('./data/maps')
jest.mock('./data/items')
jest.mock('./data/levels', () => ({ levels: [], itemUnlockLevels: {} }))
jest.mock('./data/recipes')
jest.mock('./data/shop-inventory')

jest.mock('./constants', () => ({
  __esModule: true,
  ...jest.requireActual('./constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  PRECIPITATION_CHANCE: 0,
}))

describe('rotateNotificationLogs', () => {
  test('rotates logs', () => {
    const { notificationLog } = fn.rotateNotificationLogs({
      dayCount: 1,
      newDayNotifications: [{ message: 'b', severity: 'info' }],
      notificationLog: [
        {
          day: 0,
          notifications: {
            error: [],
            info: ['a'],
            success: [],
            warning: [],
          },
        },
      ],
    })

    expect(notificationLog).toEqual([
      {
        day: 1,
        notifications: {
          error: [],
          info: ['b'],
          success: [],
          warning: [],
        },
      },
      {
        day: 0,
        notifications: {
          error: [],
          info: ['a'],
          success: [],
          warning: [],
        },
      },
    ])
  })

  test('limits log size', () => {
    const { notificationLog } = fn.rotateNotificationLogs({
      dayCount: 50,
      newDayNotifications: [{ message: 'new log', severity: 'info' }],
      notificationLog: new Array(NOTIFICATION_LOG_SIZE).fill({
        day: 1,
        notifications: {
          error: [],
          info: ['a'],
          success: [],
          warning: [],
        },
      }),
    })

    expect(notificationLog).toHaveLength(NOTIFICATION_LOG_SIZE)
    expect(notificationLog[0]).toEqual({
      day: 50,
      notifications: {
        error: [],
        info: ['new log'],
        success: [],
        warning: [],
      },
    })
  })

  test('ignores empty logs', () => {
    const { notificationLog } = fn.rotateNotificationLogs({
      newDayNotifications: [],
      notificationLog: [
        {
          day: 0,
          notifications: [
            {
              error: [],
              info: ['a'],
              success: [],
              warning: [],
            },
          ],
        },
      ],
    })

    expect(notificationLog).toEqual([
      {
        day: 0,
        notifications: [
          {
            error: [],
            info: ['a'],
            success: [],
            warning: [],
          },
        ],
      },
    ])
  })
})

describe('createPriceEvent', () => {
  test('creates priceCrashes data', () => {
    const priceEvent = {
      itemId: sampleCropItem1.id,
      daysRemaining: 1,
    }

    const { priceCrashes } = fn.createPriceEvent(
      { priceCrashes: {} },
      priceEvent,
      'priceCrashes'
    )

    expect(priceCrashes).toMatchObject({
      [sampleCropItem1.id]: priceEvent,
    })
  })

  test('creates priceSurges data', () => {
    const priceEvent = {
      itemId: sampleCropItem1.id,
      daysRemaining: 1,
    }

    const { priceSurges } = fn.createPriceEvent(
      { priceSurges: {} },
      priceEvent,
      'priceSurges'
    )

    expect(priceSurges).toMatchObject({
      [sampleCropItem1.id]: priceEvent,
    })
  })
})

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
      jest.mock('./data/levels', () => ({
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
      const { generatePriceEvents } = jest.requireActual('./reducers')
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
      todaysPastNotifications,
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
      todaysPastNotifications: [{ message: 'some message', severity: 'info' }],
    })

    expect(shapeOf(cowForSale)).toEqual(shapeOf(generateCow()))
    expect(dayCount).toEqual(2)
    expect(valueAdjustments['sample-crop-1']).toEqual(1.25)
    expect(valueAdjustments['sample-crop-2']).toEqual(1.25)
    expect(firstRow[0].wasWateredToday).toBe(false)
    expect(firstRow[0].daysWatered).toBe(1)
    expect(firstRow[0].daysOld).toBe(1)
    expect(todaysPastNotifications).toBeEmpty()
  })
})

describe('applyPrecipitation', () => {
  test('waters all plots', () => {
    const state = fn.applyPrecipitation({
      field: [
        [
          testCrop({
            wasWateredToday: false,
          }),
          testCrop({
            wasWateredToday: false,
          }),
        ],
      ],
      newDayNotifications: [],
    })

    expect(state.field[0][0].wasWateredToday).toBe(true)
    expect(state.field[0][1].wasWateredToday).toBe(true)
  })

  describe('rain shower', () => {
    test('waters all plots', () => {
      jest.spyOn(Math, 'random').mockReturnValue(1)
      const state = fn.applyPrecipitation({
        field: [[]],
        newDayNotifications: [],
      })

      expect(state.newDayNotifications[0]).toEqual({
        message: RAIN_MESSAGE,
        severity: 'info',
      })
    })
  })

  describe('storm', () => {
    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)
    })

    describe('scarecrows are planted', () => {
      test('scarecrows are destroyed', () => {
        const state = fn.applyPrecipitation({
          field: [[getPlotContentFromItemId(SCARECROW_ITEM_ID)]],
          newDayNotifications: [],
        })

        expect(state.field[0][0]).toBe(null)
        expect(state.newDayNotifications[0]).toEqual({
          message: STORM_DESTROYS_SCARECROWS_MESSAGE,
          severity: 'error',
        })
      })
    })

    describe('scarecrows are not planted', () => {
      test('shows appropriate message', () => {
        const state = fn.applyPrecipitation({
          field: [[]],
          newDayNotifications: [],
        })

        expect(state.newDayNotifications[0]).toEqual({
          message: STORM_MESSAGE,
          severity: 'info',
        })
      })
    })
  })
})

describe('processSprinklers', () => {
  let computedState

  beforeEach(() => {
    const field = new Array(8).fill().map(() => new Array(8).fill(null))
    field[0][0] = getPlotContentFromItemId('sprinkler')
    field[1][1] = getPlotContentFromItemId('sprinkler')
    field[6][5] = getPlotContentFromItemId('sprinkler')
    field[1][0] = testCrop()
    field[2][2] = testCrop()
    field[3][3] = testCrop()

    computedState = fn.processSprinklers({
      field,
      itemsSold: {},
    })
  })

  test('waters crops within range', () => {
    expect(computedState.field[1][0].wasWateredToday).toBeTruthy()
    expect(computedState.field[2][2].wasWateredToday).toBeTruthy()
  })

  test('does not water crops out of range', () => {
    expect(computedState.field[3][3].wasWateredToday).toBeFalsy()
  })
})

describe('processFeedingCows', () => {
  let state

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
    }
  })

  describe('player has no cow feed', () => {
    beforeEach(() => {
      state.cowInventory = [generateCow({ weightMultiplier: 1 })]
    })

    test('cows weight goes down', () => {
      const {
        cowInventory: [{ weightMultiplier }],
      } = fn.processFeedingCows(state)

      expect(weightMultiplier).toEqual(1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT)
    })
  })

  describe('player has cow feed', () => {
    beforeEach(() => {
      state.cowInventory = [
        generateCow({ weightMultiplier: 1 }),
        generateCow({ weightMultiplier: 1 }),
      ]
    })

    describe('there are more feed units than cows to feed', () => {
      test('units are distributed to cows', () => {
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 4 }]
        const {
          cowInventory,
          inventory: [{ quantity }],
        } = fn.processFeedingCows(state)

        expect(cowInventory[0].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(cowInventory[1].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(quantity).toEqual(2)
      })
    })

    describe('there are more cows to feed than feed units', () => {
      test('units are distributed to cows and remainder goes hungry', () => {
        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 1 }]
        const { cowInventory, inventory } = fn.processFeedingCows(state)

        expect(cowInventory[0].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(cowInventory[1].weightMultiplier).toEqual(
          1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(inventory).toHaveLength(0)
      })
    })

    describe('mixed set of weightMultipliers with unsufficient cow feed units', () => {
      test('units are distributed to cows and remainder goes hungry', () => {
        state.cowInventory = [
          generateCow({ weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM }),
          generateCow({ weightMultiplier: COW_WEIGHT_MULTIPLIER_MAXIMUM }),
          generateCow({ weightMultiplier: 1 }),
          generateCow({ weightMultiplier: 1 }),
        ]

        state.inventory = [{ id: COW_FEED_ITEM_ID, quantity: 3 }]

        const { cowInventory, inventory } = fn.processFeedingCows(state)

        expect(cowInventory[0].weightMultiplier).toEqual(
          COW_WEIGHT_MULTIPLIER_MAXIMUM
        )
        expect(cowInventory[1].weightMultiplier).toEqual(
          COW_WEIGHT_MULTIPLIER_MAXIMUM
        )
        expect(cowInventory[2].weightMultiplier).toEqual(
          1 + COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(cowInventory[3].weightMultiplier).toEqual(
          1 - COW_WEIGHT_MULTIPLIER_FEED_BENEFIT
        )
        expect(inventory).toHaveLength(0)
      })
    })
  })
})

describe('processCowAttrition', () => {
  test('unfed cows leave', () => {
    const unfedCow = generateCow({
      name: 'unfed cow',
      weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
    })
    const fedCow = generateCow({ name: 'fed cow', weightMultiplier: 1 })

    const { cowInventory, newDayNotifications } = fn.processCowAttrition({
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowInventory: [unfedCow, fedCow],
      inventory: [],
      newDayNotifications: [],
    })

    expect(cowInventory).toEqual([fedCow])
    expect(newDayNotifications).toEqual([
      { message: COW_ATTRITION_MESSAGE`${unfedCow}`, severity: 'error' },
    ])
  })

  test('used hugging machines are returned to inventory', () => {
    const unfedCow = generateCow({
      name: 'unfed cow',
      weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
    })
    const unfedCowWithHuggingMachine = generateCow({
      name: 'unfed cow',
      weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
      isUsingHuggingMachine: true,
    })

    const { cowInventory, inventory } = fn.processCowAttrition({
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowInventory: [unfedCow, unfedCowWithHuggingMachine],
      inventory: [],
      inventoryLimit: -1,
      newDayNotifications: [],
    })

    expect(cowInventory).toEqual([])
    expect(inventory).toEqual([{ id: huggingMachine.id, quantity: 1 }])
  })
})

describe('processMilkingCows', () => {
  let state

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
      inventoryLimit: -1,
      newDayNotifications: [],
    }
  })

  describe('cow should not be milked', () => {
    test('cow is not milked', () => {
      const baseDaysSinceMilking = 2

      state.cowInventory = [
        generateCow({
          daysSinceMilking: baseDaysSinceMilking,
          gender: genders.FEMALE,
        }),
      ]

      const {
        cowInventory: [{ daysSinceMilking }],
        inventory,
        newDayNotifications,
      } = fn.processMilkingCows(state)

      expect(daysSinceMilking).toEqual(baseDaysSinceMilking)
      expect(inventory).toEqual([])
      expect(newDayNotifications).toEqual([])
    })
  })

  describe('cow should be milked', () => {
    describe('inventory space is available', () => {
      test('cow is milked and milk is added to inventory', () => {
        state.cowInventory = [
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceMilking: Math.ceil(COW_MILK_RATE_SLOWEST / 2),
            gender: genders.FEMALE,
          }),
        ]

        const {
          cowInventory: [cow],
          inventory,
          newDayNotifications,
        } = fn.processMilkingCows(state)

        const { daysSinceMilking } = cow

        expect(daysSinceMilking).toEqual(0)
        expect(inventory).toEqual([{ id: 'milk-1', quantity: 1 }])
        expect(newDayNotifications).toEqual([
          {
            message: MILKS_PRODUCED`${{ [getCowMilkItem(cow).name]: 1 }}`,
            severity: 'success',
          },
        ])
      })
    })

    describe('inventory space is not available', () => {
      test('cow is milked and milk is added to inventory', () => {
        state.inventoryLimit = 1
        state.cowInventory = [
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceMilking: Math.ceil(COW_MILK_RATE_SLOWEST / 2),
            gender: genders.FEMALE,
          }),
          generateCow({
            color: standardCowColors.WHITE,
            daysSinceMilking: Math.ceil(COW_MILK_RATE_SLOWEST / 2),
            gender: genders.FEMALE,
          }),
        ]

        const {
          cowInventory: [cow],
          inventory,
          newDayNotifications,
        } = fn.processMilkingCows(state)

        const { daysSinceMilking } = cow

        expect(daysSinceMilking).toEqual(0)
        expect(inventory).toEqual([{ id: 'milk-1', quantity: 1 }])
        expect(newDayNotifications).toEqual([
          {
            message: MILKS_PRODUCED`${{ [getCowMilkItem(cow).name]: 1 }}`,
            severity: 'success',
          },
        ])
      })
    })
  })
})

describe('processWeather', () => {
  describe('rain', () => {
    describe('is not rainy day', () => {
      test('does not water plants', () => {
        const state = fn.processWeather({
          field: [[testCrop()]],
          newDayNotifications: [],
        })

        expect(state.field[0][0].wasWateredToday).toBe(false)
      })
    })

    describe('is rainy day', () => {
      test('does water plants', () => {
        jest.resetModules()
        jest.mock('./constants', () => ({
          PRECIPITATION_CHANCE: 1,
        }))

        const { processWeather } = jest.requireActual('./reducers')
        const state = processWeather({
          field: [[testCrop()]],
          newDayNotifications: [],
        })

        expect(state.field[0][0].wasWateredToday).toBe(true)
      })
    })
  })
})

describe('processNerfs', () => {
  describe('crows', () => {
    describe('crows do not attack', () => {
      test('crop is safe', () => {
        const state = fn.processNerfs({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          newDayNotifications: [],
        })

        expect(state.field[0][0]).toEqual(testCrop({ itemId: 'sample-crop-1' }))
        expect(state.newDayNotifications).toEqual([])
      })
    })

    describe('crows attack', () => {
      test('crop is destroyed', () => {
        jest.resetModules()
        jest.mock('./constants', () => ({
          CROW_CHANCE: 1,
        }))

        const { processNerfs } = jest.requireActual('./reducers')
        const state = processNerfs({
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          newDayNotifications: [],
        })

        expect(state.field[0][0]).toBe(null)
        expect(state.newDayNotifications).toEqual([
          {
            message: CROW_ATTACKED`${itemsMap['sample-crop-1']}`,
            severity: 'error',
          },
        ])
      })

      describe('there is a scarecrow', () => {
        test('crow attack is prevented', () => {
          jest.resetModules()
          jest.mock('./constants', () => ({
            CROW_CHANCE: 1,
            SCARECROW_ITEM_ID: 'scarecrow',
          }))

          const { processNerfs } = jest.requireActual('./reducers')
          const state = processNerfs({
            field: [
              [
                testCrop({ itemId: 'sample-crop-1' }),
                getPlotContentFromItemId(SCARECROW_ITEM_ID),
              ],
            ],
            newDayNotifications: [],
          })

          expect(state.field[0][0]).toEqual(
            testCrop({ itemId: 'sample-crop-1' })
          )
          expect(state.newDayNotifications).toEqual([])
        })
      })
    })
  })
})

describe('resetWasWatered', () => {
  test('updates wasWateredToday property', () => {
    expect(fn.resetWasWatered(testCrop({ itemId: 'sample-crop-1' }))).toEqual(
      testCrop({ itemId: 'sample-crop-1' })
    )

    expect(
      fn.resetWasWatered(
        testCrop({ itemId: 'sample-crop-2', wasWateredToday: true })
      )
    ).toEqual(testCrop({ itemId: 'sample-crop-2' }))

    expect(fn.resetWasWatered(null)).toBe(null)
  })
})

describe('addItemToInventory', () => {
  test('creates a new item in the inventory', () => {
    expect(
      fn.addItemToInventory(
        { inventory: [], inventoryLimit: -1 },
        { id: 'sample-item-1' }
      )
    ).toMatchObject({ inventory: [{ id: 'sample-item-1', quantity: 1 }] })
  })

  test('increments an existing item in the inventory', () => {
    expect(
      fn.addItemToInventory(
        {
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
          inventoryLimit: -1,
        },
        { id: 'sample-item-1' }
      )
    ).toMatchObject({
      inventory: [
        {
          id: 'sample-item-1',
          quantity: 2,
        },
      ],
    })
  })

  describe('there is not enough room in the inventory', () => {
    describe('there is no room for any of the items being added', () => {
      test('no items are added', () => {
        expect(
          fn.addItemToInventory(
            {
              inventory: [{ id: 'sample-item-1', quantity: 3 }],
              inventoryLimit: 3,
            },
            { id: 'sample-item-2' }
          )
        ).toMatchObject({
          inventory: [
            {
              id: 'sample-item-1',
              quantity: 3,
            },
          ],
        })
      })
    })

    describe('there is only room for some of the items being added', () => {
      test('a reduced amount of items are added', () => {
        expect(
          fn.addItemToInventory(
            {
              inventory: [{ id: 'sample-item-1', quantity: 2 }],
              inventoryLimit: 3,
            },
            { id: 'sample-item-2' },
            10
          )
        ).toMatchObject({
          inventory: [
            {
              id: 'sample-item-1',
              quantity: 2,
            },
            {
              id: 'sample-item-2',
              quantity: 1,
            },
          ],
        })
      })
    })
  })
})

describe('processCowBreeding', () => {
  const maleCow1 = generateCow({ gender: genders.MALE, happiness: 1 })
  const maleCow2 = generateCow({ gender: genders.MALE, happiness: 1 })
  const femaleCow = generateCow({ gender: genders.FEMALE, happiness: 1 })

  describe('there are less than two cows in breeding pen', () => {
    test('no-ops', () => {
      const inputState = {
        cowBreedingPen: {
          cowId1: maleCow1.id,
          cowId2: null,
          daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
        },
        cowInventory: [maleCow1],
        newDayNotifications: [],
        purchasedCowPen: 1,
      }

      const state = fn.processCowBreeding(inputState)

      expect(state).toBe(inputState)
    })
  })

  describe('there are two cows in breeding pen', () => {
    describe('cows are same gender', () => {
      test('no-ops', () => {
        const inputState = {
          cowBreedingPen: {
            cowId1: maleCow1.id,
            cowId2: maleCow2.id,
            daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
          },
          cowInventory: [maleCow1, maleCow2],
          newDayNotifications: [],
          purchasedCowPen: 1,
        }

        const state = fn.processCowBreeding(inputState)

        expect(state).toBe(inputState)
      })
    })

    describe('cows are opposite gender', () => {
      describe('at least one cow does not meet happiness requirement', () => {
        test('resets daysUntilBirth', () => {
          const {
            cowBreedingPen: { daysUntilBirth },
          } = fn.processCowBreeding({
            cowBreedingPen: {
              cowId1: maleCow1.id,
              cowId2: femaleCow.id,
              daysUntilBirth: COW_GESTATION_PERIOD_DAYS - 1,
            },
            cowInventory: [
              generateCow({ ...maleCow1, happiness: 0 }),
              femaleCow,
            ],
            newDayNotifications: [],
            purchasedCowPen: 1,
          })

          expect(daysUntilBirth).toEqual(COW_GESTATION_PERIOD_DAYS)
        })
      })

      describe('both cows meet happiness requirement', () => {
        describe('daysUntilBirth > 1', () => {
          test('decrements daysUntilBirth', () => {
            const {
              cowBreedingPen: { daysUntilBirth },
            } = fn.processCowBreeding({
              cowBreedingPen: {
                cowId1: maleCow1.id,
                cowId2: femaleCow.id,
                daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
              },
              cowInventory: [maleCow1, femaleCow],
              newDayNotifications: [],
              purchasedCowPen: 1,
            })

            expect(daysUntilBirth).toEqual(COW_GESTATION_PERIOD_DAYS - 1)
          })
        })

        describe('daysUntilBirth === 1', () => {
          describe('there is space in cowInventory', () => {
            test('adds offspring cow to cowInventory', () => {
              const { cowInventory } = fn.processCowBreeding({
                cowBreedingPen: {
                  cowId1: maleCow1.id,
                  cowId2: femaleCow.id,
                  daysUntilBirth: 1,
                },
                cowInventory: [maleCow1, femaleCow],
                newDayNotifications: [],
                purchasedCowPen: 1,
              })

              expect(cowInventory).toHaveLength(3)
            })
          })

          describe('there is no space in cowInventory', () => {
            test('offspring cow is not added to cowInventory', () => {
              const { cowInventory } = fn.processCowBreeding({
                cowBreedingPen: {
                  cowId1: maleCow1.id,
                  cowId2: femaleCow.id,
                  daysUntilBirth: 1,
                },
                cowInventory: [
                  maleCow1,
                  femaleCow,
                  ...new Array(PURCHASEABLE_COW_PENS.get(1).cows - 2)
                    .fill(null)
                    .map(() => generateCow()),
                ],
                newDayNotifications: [],
                purchasedCowPen: 1,
              })

              expect(cowInventory).toHaveLength(
                PURCHASEABLE_COW_PENS.get(1).cows
              )
            })
          })

          test('resets daysUntilBirth', () => {
            const {
              cowBreedingPen: { daysUntilBirth },
            } = fn.processCowBreeding({
              cowBreedingPen: {
                cowId1: maleCow1.id,
                cowId2: femaleCow.id,
                daysUntilBirth: 1,
              },
              cowInventory: [maleCow1, femaleCow],
              newDayNotifications: [],
              purchasedCowPen: 1,
            })

            expect(daysUntilBirth).toEqual(COW_GESTATION_PERIOD_DAYS)
          })
        })
      })
    })
  })
})

describe('computeCowInventoryForNextDay', () => {
  test('ages cows', () => {
    expect(
      fn.computeCowInventoryForNextDay({
        cowInventory: [
          { daysOld: 0 },
          { daysOld: 5, happiness: 0.5, happinessBoostsToday: 3 },
        ],
      })
    ).toMatchObject({
      cowInventory: [
        { daysOld: 1, happinessBoostsToday: 0 },
        {
          daysOld: 6,
          happiness: 0.5 - COW_HUG_BENEFIT,
          happinessBoostsToday: 0,
        },
      ],
    })
  })

  describe('happiness', () => {
    describe('has a hugging machine', () => {
      test('happiness is pre-maxed for the day', () => {
        expect(
          fn.computeCowInventoryForNextDay({
            cowInventory: [
              {
                daysOld: 5,
                happiness: 0,
                happinessBoostsToday: 0,
                isUsingHuggingMachine: true,
              },
            ],
          })
        ).toMatchObject({
          cowInventory: [
            {
              daysOld: 6,
              happiness: COW_HUG_BENEFIT * (MAX_DAILY_COW_HUG_BENEFITS - 1),
              happinessBoostsToday: MAX_DAILY_COW_HUG_BENEFITS,
              isUsingHuggingMachine: true,
            },
          ],
        })
      })
    })
  })
})

describe('incrementPlotContentAge', () => {
  describe('plot contains a crop', () => {
    describe('crop is not watered', () => {
      test('updates daysOld', () => {
        const { daysOld, daysWatered } = fn.incrementPlotContentAge(
          testCrop({ itemId: 'sample-crop-1' })
        )

        expect(daysOld).toBe(1)
        expect(daysWatered).toBe(0)
      })
    })

    describe('crop is watered', () => {
      test('updates daysOld and daysWatered', () => {
        const { daysOld, daysWatered } = fn.incrementPlotContentAge(
          testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
        )

        expect(daysOld).toBe(1)
        expect(daysWatered).toBe(1)
      })
    })

    describe('crop is fertilized', () => {
      test('updates daysOld with bonus', () => {
        const { daysWatered } = fn.incrementPlotContentAge(
          testCrop({
            itemId: 'sample-crop-1',
            isFertilized: true,
            wasWateredToday: true,
          })
        )

        expect(daysWatered).toBe(1 + FERTILIZER_BONUS)
      })
    })
  })

  describe('plot contains a non-crop item', () => {
    test('plot content is not changed', () => {
      const plotContent = testCrop({ itemId: 'scarecrow' })

      expect(fn.incrementPlotContentAge(plotContent)).toBe(plotContent)
    })
  })
})

describe('decrementItemFromInventory', () => {
  let updatedState

  describe('item is not in inventory', () => {
    beforeEach(() => {
      updatedState = fn.decrementItemFromInventory(
        { inventory: [testItem({ id: 'sample-item-1', quantity: 1 })] },
        'nonexistent-item'
      )
    })

    test('no-ops', () => {
      expect(updatedState).toMatchObject({
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
      })
    })
  })

  describe('item is in inventory', () => {
    describe('single instance of item in inventory', () => {
      beforeEach(() => {
        updatedState = fn.decrementItemFromInventory(
          { inventory: [testItem({ id: 'sample-item-1', quantity: 1 })] },
          'sample-item-1'
        )
      })

      test('removes item from inventory', () => {
        expect(updatedState).toMatchObject({ inventory: [] })
      })
    })

    describe('multiple instances of item in inventory', () => {
      beforeEach(() => {
        updatedState = fn.decrementItemFromInventory(
          { inventory: [testItem({ id: 'sample-item-1', quantity: 2 })] },
          'sample-item-1'
        )
      })

      test('decrements item', () => {
        expect(updatedState).toMatchObject({
          inventory: [
            testItem({
              id: 'sample-item-1',
              quantity: 1,
            }),
          ],
        })
      })
    })
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
            valueAdjustments: { 'sample-item-1': 1 },
          },
          { id: 'sample-item-1' },
          2
        )
      ).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
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
              valueAdjustments: { 'sample-item-1': 1 },
            },
            { id: 'sample-item-1' },
            1
          )
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
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
              valueAdjustments: { 'sample-item-1': 1 },
            },
            { id: 'sample-item-1' },
            10
          )
        ).toMatchObject({
          inventory: [{ id: 'sample-item-1', quantity: 3 }],
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

describe('showNotification', () => {
  test('sets notification state', () => {
    const { notifications, doShowNotifications } = fn.showNotification(
      { notifications: [] },
      'foo'
    )
    expect(notifications).toEqual([{ message: 'foo', severity: 'info' }])
    expect(doShowNotifications).toEqual(true)
  })

  test('does not show redundant notifications', () => {
    const state = fn.showNotification({ notifications: [] }, 'foo')

    const { notifications } = fn.showNotification(state, 'foo')
    expect(notifications).toEqual([{ message: 'foo', severity: 'info' }])
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
        notifications: [],
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
        notifications: [],
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
            notifications: [],
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
              notifications: [],
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
              notifications: [],
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
          expect(state.notifications).toEqual([
            { message: LOAN_PAYOFF``, severity: 'success' },
          ])
        })
      })
    })
  })
})

describe('processLevelUp', () => {
  test('shows notifications for each level gained in the sale', () => {
    jest.resetModules()
    jest.mock('./data/levels', () => ({
      levels: [
        {
          id: 1,
          unlocksShopItem: 'sample-crop-seeds-1',
        },
      ],
      itemUnlockLevels: {},
    }))
    const { notifications } = jest.requireActual('./reducers').processLevelUp(
      {
        inventory: [],
        itemsSold: { 'sample-crop-1': farmProductSalesVolumeNeededForLevel(3) },
        notifications: [],
      },
      1
    )

    expect(notifications).toEqual([
      {
        message: LEVEL_GAINED_NOTIFICATION`${3}${{ name: '' }}`,
        severity: 'success',
      },
      {
        message: LEVEL_GAINED_NOTIFICATION`${2}${{ name: '' }}`,
        severity: 'success',
      },
    ])
  })

  test('when sprinkler is selected when it gets a level up boost, hoveredPlotRangeSize increase', () => {
    jest.resetModules()
    jest.mock('./data/levels', () => ({
      levels: [
        {
          id: 0,
        },
        {
          id: 1,
        },
        {
          id: 2,
          increasesSprinklerRange: true,
        },
      ],
      itemUnlockLevels: {},
    }))
    jest.mock('./constants', () => ({
      INITIAL_SPRINKLER_RANGE: 1,
      SPRINKLER_ITEM_ID: 'sprinkler',
    }))

    const { hoveredPlotRangeSize } = jest
      .requireActual('./reducers')
      .processLevelUp(
        {
          hoveredPlotRangeSize: 1,
          itemsSold: {
            'sample-crop-1': farmProductSalesVolumeNeededForLevel(2),
          },
          selectedItemId: 'sprinkler',
          notifications: [],
        },
        1
      )

    expect(hoveredPlotRangeSize).toEqual(2)
  })
})

describe('purchaseCow', () => {
  const cow = Object.freeze(
    generateCow({
      baseWeight: 1000,
      color: standardCowColors.WHITE,
      gender: genders.FEMALE,
      name: 'cow',
    })
  )

  test('purchases a cow', () => {
    const oldCowForSale = generateCow()

    const state = fn.purchaseCow(
      {
        cowForSale: oldCowForSale,
        cowInventory: [],
        cowColorsPurchased: {},
        money: 5000,
        purchasedCowPen: 1,
      },
      cow
    )

    expect(state).toMatchObject({
      cowInventory: [cow],
      money: 5000 - getCowValue(cow),
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
      gender: genders.FEMALE,
      name: 'cow',
      isBred: false,
    })
  })

  describe('cow is bred', () => {
    test('cow is sold as revenue', () => {
      cow = Object.freeze({
        baseWeight: 1000,
        color: standardCowColors.BLUE,
        gender: genders.FEMALE,
        name: 'cow',
        isBred: true,
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
      expect(money).toEqual(getCowValue(cow))
      expect(revenue).toEqual(getCowValue(cow))
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
      expect(money).toEqual(getCowValue(cow))
      expect(revenue).toEqual(0)
    })
  })

  describe('cow has hugging machine', () => {
    test('returns hugging machine to inventory', () => {
      const cow = Object.freeze({
        baseWeight: 1000,
        gender: genders.FEMALE,
        isUsingHuggingMachine: true,
        name: 'cow',
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

describe('plantInPlot', () => {
  describe('crop quantity > 1', () => {
    describe('plot is empty', () => {
      test('plants the crop', () => {
        const state = fn.plantInPlot(
          {
            field: [[]],
            inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 2 })],
            itemsSold: {},
            selectedItemId: 'sample-crop-seeds-1',
          },
          0,
          0,
          'sample-crop-seeds-1'
        )

        expect(state.field[0][0]).toEqual(getCropFromItemId('sample-crop-1'))

        expect(state.inventory[0].quantity).toEqual(1)
      })
    })

    describe('plot is not empty', () => {
      test('does not decrement crop quantity', () => {
        const state = fn.plantInPlot(
          {
            field: [[getCropFromItemId('sample-crop-seeds-1')]],
            inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 2 })],
            selectedItemId: 'sample-crop-seeds-1',
          },
          0,
          0,
          'sample-crop-seeds-1'
        )

        expect(state.inventory[0].quantity).toEqual(2)
      })
    })
  })

  describe('crop quantity === 1', () => {
    test('resets selectedItemId state', () => {
      const state = fn.plantInPlot(
        {
          field: [[]],
          inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 1 })],
          itemsSold: {},
          selectedItemId: 'sample-crop-seeds-1',
        },
        0,
        0,
        'sample-crop-seeds-1'
      )

      expect(state.selectedItemId).toEqual('')
    })
  })

  describe('crop is not in inventory', () => {
    test('no-ops', () => {
      const inputState = {
        field: [[]],
        inventory: [],
        selectedItemId: 'sample-crop-seeds-1',
      }
      const state = fn.plantInPlot(inputState, 0, 0, 'sample-crop-seeds-1')

      expect(inputState).toEqual(state)
    })
  })
})

describe('fertilizeCrop', () => {
  describe('no fertilizer in inventory', () => {
    test('no-ops', () => {
      const oldState = {
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
        inventory: [],
        selectedItemId: FERTILIZER_ITEM_ID,
      }
      const state = fn.fertilizeCrop(oldState, 0, 0)
      expect(state).toBe(oldState)
    })
  })

  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const oldState = {
        field: [[getPlotContentFromItemId('sprinkler')]],
        inventory: [],
      }
      const state = fn.fertilizeCrop(oldState, 0, 0)
      expect(state).toBe(oldState)
    })
  })

  describe('unfertilized crops', () => {
    describe('happy path', () => {
      test('fertilizes crop', () => {
        const state = fn.fertilizeCrop(
          {
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
            selectedItemId: FERTILIZER_ITEM_ID,
          },
          0,
          0
        )

        expect(state.field[0][0]).toEqual(
          testCrop({ itemId: 'sample-crop-1', isFertilized: true })
        )
        expect(state.inventory).toEqual([])
      })
    })

    describe('FERTILIZE field mode updating', () => {
      describe('multiple fertilizer units remaining', () => {
        beforeEach(() => {})

        test('does not change fieldMode', () => {
          const state = fn.fertilizeCrop(
            {
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 2 })],
            },
            0,
            0
          )

          expect(state.fieldMode).toBe(fieldMode.FERTILIZE)
          expect(state.selectedItemId).toBe('fertilizer')
        })
      })

      describe('one fertilizer unit remaining', () => {
        test('changes fieldMode to OBSERVE', () => {
          const state = fn.fertilizeCrop(
            {
              field: [[testCrop({ itemId: 'sample-crop-1' })]],
              inventory: [testItem({ id: 'fertilizer', quantity: 1 })],
            },
            0,
            0
          )

          expect(state.fieldMode).toBe(fieldMode.OBSERVE)
          expect(state.selectedItemId).toBe('')
        })
      })
    })
  })
})

describe('setSprinkler', () => {
  let state

  beforeEach(() => {
    state = {
      field: [[null]],
      fieldMode: fieldMode.SET_SPRINKLER,
      inventory: [testItem({ id: 'sprinkler', quantity: 1 })],
      itemsSold: {},
      selectedItemId: SPRINKLER_ITEM_ID,
    }
  })

  describe('plot is not empty', () => {
    test('does nothing', () => {
      const inputState = { ...state, field: [[testCrop()]] }
      state = fn.setSprinkler(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('plot is empty', () => {
    test('sets sprinkler', () => {
      const { field, inventory } = fn.setSprinkler(state, 0, 0)

      expect(field[0][0]).toEqual(getPlotContentFromItemId('sprinkler'))
      expect(inventory).toHaveLength(0)
    })

    describe('multiple sprinkler units remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = fn.setSprinkler(
          { ...state, inventory: [testItem({ id: 'sprinkler', quantity: 2 })] },
          0,
          0
        )
        expect(newFieldMode).toBe(fieldMode.SET_SPRINKLER)
        expect(selectedItemId).toBe(SPRINKLER_ITEM_ID)
      })
    })

    describe('one sprinkler unit remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = fn.setSprinkler(
          state,
          0,
          0
        )

        expect(newFieldMode).toBe(fieldMode.OBSERVE)
        expect(selectedItemId).toBe('')
      })
    })
  })
})

describe('setScarecrow', () => {
  let state

  beforeEach(() => {
    state = {
      field: [[null]],
      fieldMode: fieldMode.SET_SCARECROW,
      inventory: [testItem({ id: 'scarecrow', quantity: 1 })],
      selectedItemId: SCARECROW_ITEM_ID,
    }
  })

  describe('plot is not empty', () => {
    test('does nothing', () => {
      const inputState = { ...state, field: [[testCrop()]] }
      state = fn.setScarecrow(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('plot is empty', () => {
    test('sets scarecrow', () => {
      const { inventory, field } = fn.setScarecrow(state, 0, 0)
      expect(inventory).toHaveLength(0)
      expect(field[0][0]).toEqual(getPlotContentFromItemId('scarecrow'))
    })

    describe('multiple scarecrow units remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = fn.setScarecrow(
          { ...state, inventory: [testItem({ id: 'scarecrow', quantity: 2 })] },
          0,
          0
        )

        expect(newFieldMode).toBe(fieldMode.SET_SCARECROW)
        expect(selectedItemId).toBe(SCARECROW_ITEM_ID)
      })
    })

    describe('one scarecrow unit remaining', () => {
      test('updates state', () => {
        const { fieldMode: newFieldMode, selectedItemId } = fn.setScarecrow(
          state,
          0,
          0
        )

        expect(newFieldMode).toBe(fieldMode.OBSERVE)
        expect(selectedItemId).toBe('')
      })
    })
  })
})

describe('harvestPlot', () => {
  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const inputState = {
        cropsHarvested: {},
        field: [[getPlotContentFromItemId('sprinkler')]],
      }
      const state = fn.harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('unripe crops', () => {
    test('no-ops', () => {
      const inputState = {
        cropsHarvested: {},
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
      }
      const state = fn.harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('ripe crops', () => {
    test('harvests the plot', () => {
      const { cropsHarvested, field, inventory } = fn.harvestPlot(
        {
          cropsHarvested: {},
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [],
          inventoryLimit: -1,
        },
        0,
        0
      )

      expect(field[0][0]).toBe(null)
      expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 1 }])
      expect(cropsHarvested).toEqual({ SAMPLE_CROP_TYPE_1: 1 })
    })

    describe('there is insufficient inventory space', () => {
      test('no-ops', () => {
        const inputState = {
          cropsHarvested: {},
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [{ id: 'sample-crop-1', quantity: 5 }],
          inventoryLimit: 5,
        }
        const state = fn.harvestPlot(inputState, 0, 0)

        expect(state).toEqual(inputState)
      })
    })
  })
})

describe('clearPlot', () => {
  describe('plotContent is a crop', () => {
    test('clears the plot', () => {
      const { field } = fn.clearPlot(
        {
          field: [[testCrop({ itemId: 'sample-crop-1' })]],
          inventory: [],
          inventoryLimit: -1,
        },
        0,
        0
      )

      expect(field[0][0]).toBe(null)
    })

    describe('there is no room in the inventory', () => {
      test('clears the plot', () => {
        const { field, inventory } = fn.clearPlot(
          {
            field: [[testCrop({ itemId: 'sample-crop-1' })]],
            inventory: [{ id: 'sample-item-1', quantity: 5 }],
            inventoryLimit: 5,
          },
          0,
          0
        )

        expect(field[0][0]).toBe(null)
        expect(inventory).toEqual([{ id: 'sample-item-1', quantity: 5 }])
      })
    })
  })

  describe('plotContent is replantable', () => {
    test('updates state', () => {
      const { field, inventory } = fn.clearPlot(
        {
          field: [[getPlotContentFromItemId('replantable-item')]],
          inventory: [],
          inventoryLimit: -1,
        },
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'replantable-item', quantity: 1 }])
      expect(field[0][0]).toBe(null)
    })

    describe('there is no room in the inventory', () => {
      test('no-ops', () => {
        const inputState = {
          field: [[getPlotContentFromItemId('replantable-item')]],
          inventory: [{ id: 'sample-item-1', quantity: 5 }],
          inventoryLimit: 5,
        }
        const state = fn.clearPlot(inputState, 0, 0)

        expect(state).toEqual(inputState)
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
      jest.mock('./constants', () => ({
        PURCHASEABLE_FIELD_SIZES: new Map([
          [1, { columns: 3, rows: 4, price: 1000 }],
        ]),
      }))

      const { purchaseField } = jest.requireActual('./reducers')

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

describe('waterAllPlots', () => {
  test('sets wasWateredToday to true for all plots', () => {
    const { field } = fn.waterAllPlots({
      field: [
        [
          testCrop({ itemId: 'sample-crop-1' }),
          testCrop({ itemId: 'sample-crop-2' }),
        ],
        [testCrop({ itemId: 'sample-crop-3' })],
      ],
    })

    expect(field[0][0].wasWateredToday).toBe(true)
    expect(field[0][1].wasWateredToday).toBe(true)
    expect(field[1][0].wasWateredToday).toBe(true)
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
        money: STORAGE_EXPANSION_PRICE - 1,
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
        money: STORAGE_EXPANSION_PRICE,
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
    jest.mock('./data/achievements', () => [
      {
        id: 'test-achievement',
        name: 'Test Achievement',
        description: '',
        rewardDescription: '',
        condition: state => !state.conditionSatisfied,
        reward: state => ({ ...state, conditionSatisfied: true }),
      },
    ])

    updateAchievements = jest.requireActual('./reducers').updateAchievements
  })

  describe('achievement was not previously met', () => {
    describe('condition is not met', () => {
      test('does not update state', () => {
        const inputState = {
          completedAchievements: {},
          conditionSatisfied: true,
          notifications: [],
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
          notifications: [],
        }

        const state = updateAchievements(inputState)

        expect(state).toMatchObject({
          completedAchievements: { 'test-achievement': true },
          conditionSatisfied: true,
          notifications: [
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
          notifications: [],
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
          notifications: [],
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
      fn.adjustLoan({ money: 100, loanBalance: 50, notifications: [] }, -25)
    ).toEqual({
      money: 75,
      loanBalance: 25,
      notifications: [],
    })
  })

  describe('loan payoff', () => {
    test('shows appropriate notification', () => {
      const { loansTakenOut, notifications } = fn.adjustLoan(
        { money: 100, loanBalance: 50, loansTakenOut: 1, notifications: [] },
        -50
      )

      expect(notifications).toEqual([
        { message: LOAN_PAYOFF``, severity: 'success' },
      ])

      expect(loansTakenOut).toEqual(1)
    })
  })

  describe('loan increase', () => {
    test('shows appropriate notification, updates state', () => {
      const { loansTakenOut, notifications } = fn.adjustLoan(
        { money: 100, loanBalance: 50, notifications: [], loansTakenOut: 1 },
        50
      )

      expect(notifications).toEqual([
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
