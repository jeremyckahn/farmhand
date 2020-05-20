import { shapeOf, testCrop, testItem } from './test-utils'
import { RAIN_MESSAGE } from './strings'
import { MILK_PRODUCED, CROW_ATTACKED } from './templates'
import {
  COW_FEED_ITEM_ID,
  COW_HUG_BENEFIT,
  COW_MILK_RATE_SLOWEST,
  COW_WEIGHT_MULTIPLIER_MAXIMUM,
  COW_WEIGHT_MULTIPLIER_FEED_BENEFIT,
  FERTILIZER_BONUS,
  FERTILIZER_ITEM_ID,
  MAX_ANIMAL_NAME_LENGTH,
  NOTIFICATION_LOG_SIZE,
  PURCHASEABLE_COW_PENS,
  SCARECROW_ITEM_ID,
  SPRINKLER_ITEM_ID,
} from './constants'
import { sampleCropItem1 } from './data/items'
import { sampleRecipe1 } from './data/recipes'
import { itemsMap } from './data/maps'
import { fieldMode, genders } from './enums'
import {
  generateCow,
  getCowMilkItem,
  getCowValue,
  getCropFromItemId,
  getPlotContentFromItemId,
  getPriceEventForCrop,
} from './utils'
import * as fn from './reducers'

jest.mock('localforage')
jest.mock('./data/maps')
jest.mock('./data/items')
jest.mock('./data/recipes')

jest.mock('./constants', () => ({
  __esModule: true,
  ...jest.requireActual('./constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  RAIN_CHANCE: 0,
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
    test('generates a price event', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0)

      const { generatePriceEvents } = jest.requireActual('./reducers')
      const { getRandomCropItem } = jest.requireActual('./utils')
      const cropItem = getRandomCropItem()
      const state = generatePriceEvents({ priceCrashes: {}, priceSurges: {} })
      const priceEvents = { [cropItem.id]: getPriceEventForCrop(cropItem) }

      expect(state).toContainAnyEntries([
        ['priceCrashes', priceEvents],
        ['priceSurges', priceEvents],
      ])
    })
  })
})

describe('updatePriceEvents', () => {
  test.todo('updates existing price events')
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
    } = fn.computeStateForNextDay({
      dayCount: 1,
      field: [
        [
          testCrop({
            itemId: 'sample-crop-1',
            wasWateredToday: true,
          }),
        ],
      ],
      newDayNotifications: [],
      cowInventory: [],
      inventory: [],
      notificationLog: [],
    })

    expect(shapeOf(cowForSale)).toEqual(shapeOf(generateCow()))
    expect(dayCount).toEqual(2)
    expect(valueAdjustments['sample-crop-1']).toEqual(1.25)
    expect(valueAdjustments['sample-crop-2']).toEqual(1.25)
    expect(firstRow[0].wasWateredToday).toBe(false)
    expect(firstRow[0].daysWatered).toBe(1)
    expect(firstRow[0].daysOld).toBe(1)
  })
})

describe('applyRain', () => {
  test('waters all plots', () => {
    const state = fn.applyRain({
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
    expect(state.newDayNotifications[0]).toEqual({
      message: RAIN_MESSAGE,
      severity: 'info',
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

describe('processMilkingCows', () => {
  let state

  beforeEach(() => {
    state = {
      cowInventory: [],
      inventory: [],
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
    test('cow is milked', () => {
      state.cowInventory = [
        generateCow({
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
          message: MILK_PRODUCED`${cow}${getCowMilkItem(cow)}`,
          severity: 'info',
        },
      ])
    })
  })
})

describe('processBuffs', () => {
  describe('rain', () => {
    describe('is not rainy day', () => {
      test('does not water plants', () => {
        const state = fn.processBuffs({
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
          RAIN_CHANCE: 1,
        }))

        const { processBuffs } = jest.requireActual('./reducers')
        const state = processBuffs({
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
            severity: 'info',
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
        { inventory: [] },
        testItem({ id: 'sample-item-1' })
      )
    ).toMatchObject({ inventory: [{ id: 'sample-item-1', quantity: 1 }] })
  })

  test('increments an existing item in the inventory', () => {
    expect(
      fn.addItemToInventory(
        { inventory: [testItem({ id: 'sample-item-1', quantity: 1 })] },
        testItem({ id: 'sample-item-1' })
      )
    ).toMatchObject({
      inventory: [
        testItem({
          id: 'sample-item-1',
          quantity: 2,
        }),
      ],
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
})

describe('incrementCropAge', () => {
  describe('plant is not watered', () => {
    test('updates daysOld', () => {
      const { daysOld, daysWatered } = fn.incrementCropAge(
        testCrop({ itemId: 'sample-crop-1' })
      )

      expect(daysOld).toBe(1)
      expect(daysWatered).toBe(0)
    })
  })

  describe('plant is watered', () => {
    test('updates daysOld and daysWatered', () => {
      const { daysOld, daysWatered } = fn.incrementCropAge(
        testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
      )

      expect(daysOld).toBe(1)
      expect(daysWatered).toBe(1)
    })
  })

  describe('plant is fertilized', () => {
    test('updates daysOld with bonus', () => {
      const { daysWatered } = fn.incrementCropAge(
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
            money: 0,
            valueAdjustments: { 'sample-item-1': 1 },
          },
          testItem({ id: 'sample-item-1' }),
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
            money: 0,
            valueAdjustments: { 'sample-item-1': 1 },
          },
          testItem({ id: 'sample-item-1' }),
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
            money: 10,
            valueAdjustments: { 'sample-item-1': 1 },
          },
          testItem({ id: 'sample-item-1' }),
          2
        )
      ).toMatchObject({
        inventory: [{ id: 'sample-item-1', quantity: 2 }],
        money: 8,
      })
    })
  })
})

describe('purchaseItemMax', () => {
  describe('player does not have enough money for any items', () => {
    test('items are not purchased', () => {
      const { inventory, money } = fn.purchaseItemMax(
        {
          inventory: [],
          money: 1,
          valueAdjustments: { 'sample-item-1': 1e9 },
        },
        testItem({ id: 'sample-item-1' })
      )

      expect(money).toEqual(1)
      expect(inventory).toEqual([])
    })
  })

  describe('player has enough money for items', () => {
    test('max items are purchased', () => {
      const { inventory, money } = fn.purchaseItemMax(
        {
          inventory: [],
          money: 2.5,
          valueAdjustments: { 'sample-item-1': 1 },
        },
        testItem({ id: 'sample-item-1' })
      )

      expect(money).toEqual(0.5)
      expect(inventory[0].quantity).toEqual(2)
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
    test('inventory is not changed', () => {
      const { inventory } = fn.makeRecipe(
        {
          inventory: [{ id: 'sample-item-1', quantity: 1 }],
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
        money: 100,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(101)
    expect(state.itemsSold).toEqual({ 'sample-item-1': 1 })
  })

  test('updates learnedRecipes', () => {
    const { learnedRecipes } = fn.sellItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 3 })],
        itemsSold: {},
        money: 100,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' }),
      3
    )

    expect(learnedRecipes['sample-recipe-1']).toBeTruthy()
  })
})

describe('sellAllOfItem', () => {
  test('removes items from inventory', () => {
    const { inventory, money } = fn.sellAllOfItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 2 })],
        itemsSold: {},
        money: 100,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' })
    )

    expect(inventory).toEqual([])
    expect(money).toEqual(102)
  })
})

describe('purchaseCow', () => {
  const cow = Object.freeze(
    generateCow({
      baseWeight: 1000,
      gender: genders.FEMALE,
      name: 'cow',
    })
  )

  describe('happy path', () => {
    test('cow is purchased', () => {
      const oldCowForSale = generateCow()

      const state = fn.purchaseCow(
        {
          cowForSale: oldCowForSale,
          cowInventory: [],
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
    })
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
  const cow = Object.freeze({
    baseWeight: 1000,
    gender: genders.FEMALE,
    name: 'cow',
  })

  test('sells cow', () => {
    const { cowInventory, money } = fn.sellCow(
      {
        cowInventory: [cow],
        money: 0,
      },
      cow
    )

    expect(cowInventory).not.toContain(cow)
    expect(money).toEqual(getCowValue(cow))
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
          selectedItemId: 'sample-crop-seeds-1',
        },
        0,
        0,
        'sample-crop-seeds-1'
      )

      expect(state.selectedItemId).toEqual('')
    })
  })
})

describe('fertilizeCrop', () => {
  describe('non-crop plotContent', () => {
    test('no-ops', () => {
      const oldState = {
        field: [[getPlotContentFromItemId('sprinkler')]],
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
      hoveredPlot: { x: 0, y: 0 },
      hoveredPlotRangeSize: 1,
      inventory: [testItem({ id: 'sprinkler', quantity: 1 })],
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
        const {
          hoveredPlotRangeSize,
          fieldMode: newFieldMode,
          selectedItemId,
        } = fn.setSprinkler(
          { ...state, inventory: [testItem({ id: 'sprinkler', quantity: 2 })] },
          0,
          0
        )
        expect(hoveredPlotRangeSize).toBe(1)
        expect(newFieldMode).toBe(fieldMode.SET_SPRINKLER)
        expect(selectedItemId).toBe(SPRINKLER_ITEM_ID)
      })
    })

    describe('one sprinkler unit remaining', () => {
      test('updates state', () => {
        const {
          hoveredPlotRangeSize,
          fieldMode: newFieldMode,
          selectedItemId,
        } = fn.setSprinkler(state, 0, 0)

        expect(hoveredPlotRangeSize).toBe(0)
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
      hoveredPlot: { x: 0, y: 0 },
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
        field: [[getPlotContentFromItemId('sprinkler')]],
      }
      const state = fn.harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('unripe crops', () => {
    test('no-ops', () => {
      const inputState = {
        field: [[testCrop({ itemId: 'sample-crop-1' })]],
      }
      const state = fn.harvestPlot(inputState, 0, 0)
      expect(state).toEqual(inputState)
    })
  })

  describe('ripe crops', () => {
    test('harvests the plot', () => {
      const { field, inventory } = fn.harvestPlot(
        {
          field: [[testCrop({ itemId: 'sample-crop-1', daysWatered: 4 })]],
          inventory: [],
        },
        0,
        0
      )

      expect(field[0][0]).toBe(null)
      expect(inventory).toEqual([{ id: 'sample-crop-1', quantity: 1 }])
    })
  })
})

describe('clearPlot', () => {
  describe('plotContent is a crop', () => {
    test('clears the plot', () => {
      const { field } = fn.clearPlot(
        { field: [[testCrop({ itemId: 'sample-crop-1' })]], inventory: [] },
        0,
        0
      )

      expect(field[0][0]).toBe(null)
    })
  })

  describe('plotContent is replantable', () => {
    test('updates state', () => {
      const { field, inventory } = fn.clearPlot(
        {
          field: [[getPlotContentFromItemId('replantable-item')]],
          inventory: [],
        },
        0,
        0
      )

      expect(inventory).toEqual([{ id: 'replantable-item', quantity: 1 }])
      expect(field[0][0]).toBe(null)
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
