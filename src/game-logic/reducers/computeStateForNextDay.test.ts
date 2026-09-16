import { shapeOf, testCrop, testState } from '../../test-utils/index.js'
import { generateCow } from '../../utils/generateCow.js'
import { EXPERIENCE_VALUES, ONE_YEAR_LENGTH_DAYS } from '../../constants.js'
import { randomNumberService } from '../../common/services/randomNumber.js'

import { computeStateForNextDay } from './computeStateForNextDay.js'

vitest.mock('../../data/maps.js')

describe('computeStateForNextDay', () => {
  let state: farmhand.state

  beforeEach(() => {
    vitest.spyOn(Math, 'random').mockReturnValue(0.75)
    vitest
      .spyOn(randomNumberService, 'isRandomNumberLessThan')
      .mockReturnValue(true)

    state = testState({
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
      todaysNotifications: [{ message: 'some message', severity: 'info' }],
    })
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
    const ONE_YEAR = ONE_YEAR_LENGTH_DAYS
    const TWO_YEARS = ONE_YEAR_LENGTH_DAYS * 2
    const THREE_YEARS = ONE_YEAR_LENGTH_DAYS * 3
    const FOUR_YEARS = ONE_YEAR_LENGTH_DAYS * 4
    const TEN_YEARS = ONE_YEAR_LENGTH_DAYS * 10

    test.each([0, 4, ONE_YEAR - 2, ONE_YEAR, TWO_YEARS - 2, TEN_YEARS])(
      'it does not add any experience on day %s',
      dayCount => {
        const { experience } = computeStateForNextDay({ ...state, dayCount })

        expect(experience).toEqual(0)
      }
    )

    test.each([ONE_YEAR - 1, TWO_YEARS - 1, THREE_YEARS - 1, FOUR_YEARS - 1])(
      'it adds experience on day %s',
      dayCount => {
        const { experience } = computeStateForNextDay({ ...state, dayCount })

        expect(experience).toEqual(EXPERIENCE_VALUES.NEW_YEAR)
      }
    )
  })
})
