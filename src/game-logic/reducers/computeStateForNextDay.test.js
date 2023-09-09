import { shapeOf, testCrop } from '../../test-utils'
import { generateCow } from '../../utils'
import { EXPERIENCE_VALUES } from '../../constants'

import { computeStateForNextDay } from './computeStateForNextDay'

jest.mock('../../data/maps')

describe('computeStateForNextDay', () => {
  let state

  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.75)

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
    expect(firstRow[0].wasWateredToday).toBe(false)
    expect(firstRow[0].daysWatered).toBe(1)
    expect(firstRow[0].daysOld).toBe(1)
    expect(todaysNotifications).toBeEmpty()
  })

  describe('new year experience', () => {
    test.each([1, 5, 100, 364, 366, 729])(
      'it does not add any experience on day %s',
      dayCount => {
        const { experience } = computeStateForNextDay({ ...state, dayCount })

        expect(experience).toEqual(0)
      }
    )

    test.each([365, 365 * 2, 365 * 3, 365 * 4])(
      'it adds experience on day %s',
      dayCount => {
        const { experience } = computeStateForNextDay({ ...state, dayCount })

        expect(experience).toEqual(EXPERIENCE_VALUES.NEW_YEAR)
      }
    )
  })
})
