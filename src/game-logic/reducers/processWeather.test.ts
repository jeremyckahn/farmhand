import { testCrop, testState } from '../../test-utils/index.js'

import { shouldPrecipitateToday } from '../../utils/index.js'

import { processWeather } from './processWeather.js'

vitest.mock('../../data/maps.js')
vitest.mock('../../utils/index.js', async () => ({
  ...(await vitest.importActual('../../utils/index.js')),
  shouldPrecipitateToday: vitest.fn(),
}))

describe('processWeather', () => {
  test('does not water plants when there is no precipitation', () => {
    vitest.mocked(shouldPrecipitateToday).mockReturnValue(false)

    const state = processWeather(
      testState({
        field: [[testCrop()]],
        newDayNotifications: [],
      })
    )

    expect(state.field[0][0]?.wasWateredToday).toBe(false)
  })

  test('does water plants on a rainy day', () => {
    vitest.mocked(shouldPrecipitateToday).mockReturnValue(true)

    const state = processWeather(
      testState({
        field: [[testCrop()]],
        inventory: [],
        newDayNotifications: [],
      })
    )

    expect(state.field[0][0]?.wasWateredToday).toBe(true)
  })
})
