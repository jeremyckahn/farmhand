import { testCrop } from '../../test-utils'

import { shouldPrecipitateToday } from '../../utils'

import { processWeather } from './processWeather'

vitest.mock('../../data/maps')
vitest.mock('../../utils', async () => ({
  ...(await vitest.importActual('../../utils')),
  shouldPrecipitateToday: vitest.fn(),
}))

describe('processWeather', () => {
  test('does not water plants when there is no precipitation', () => {
    shouldPrecipitateToday.mockReturnValue(false)

    const state = processWeather({
      field: [[testCrop()]],
      newDayNotifications: [],
    })

    expect(state.field[0][0].wasWateredToday).toBe(false)
  })

  test('does water plants on a rainy day', () => {
    shouldPrecipitateToday.mockReturnValue(true)

    const state = processWeather({
      field: [[testCrop()]],
      inventory: [],
      newDayNotifications: [],
    })

    expect(state.field[0][0].wasWateredToday).toBe(true)
  })
})
