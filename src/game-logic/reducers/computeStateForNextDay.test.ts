import { shapeOf, testCrop } from '../../test-utils/index.js'
import { generateCow } from '../../utils/index.js'
import { EXPERIENCE_VALUES } from '../../constants.js'

import { computeStateForNextDay } from './computeStateForNextDay.js'

vitest.mock('../../data/maps.js')

describe('computeStateForNextDay', () => {
  let state

  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(0.75)

    state = {
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
      cellarInventory: [],
      cowInventory: [],
      experience: 0,
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
    }
  })

  test('computes state for next day', () => {
    const {
      cowForSale,
      dayCount,
      field: [firstRow],
      valueAdjustments,
      todaysNotifications,
    } = computeStateForNextDay(state)

    expect(shapeOf(cowForSale)).toEqual(shapeOf(generateCow()))
    expect(dayCount).toEqual(2)
    expect(valueAdjustments['sample-crop-1']).toEqual(1.25)
    expect(valueAdjustments['sample-crop-2']).toEqual(1.25)
    expect(firstRow[0]?.wasWateredToday).toBe(false)
    expect(firstRow[0]?.daysWatered).toBe(1)
    expect(firstRow[0]?.daysOld).toBe(1)
    expect(todaysNotifications).toHaveLength(0)
  })

  describe('new year experience', () => {
    const ONE_YEAR = 365

    test.each([1, 5, 100, 363, 365, 730])(
      'it does not add any experience on day %s',
      dayCount => {
        const { experience } = computeStateForNextDay({ ...state, dayCount })

        expect(experience).toEqual(0)
      }
    )

    test.each([
      ONE_YEAR - 1,
      ONE_YEAR * 2 - 1,
      ONE_YEAR * 3 - 1,
      ONE_YEAR * 4 - 1,
    ])('it adds experience on day %s', dayCount => {
      const { experience } = computeStateForNextDay({ ...state, dayCount })

      expect(experience).toEqual(EXPERIENCE_VALUES.NEW_YEAR)
    })
  })
})
