import { testCrop, testState } from '../../test-utils/index.ts'

import { shouldPrecipitateToday } from '../../utils/index.tsx'

import { processWeather } from './processWeather.ts'

vitest.mock('../../data/maps.ts')
vitest.mock('../../utils/index.tsx', async () => ({
  ...(await vitest.importActual('../../utils/index.tsx')),
  shouldPrecipitateToday: vitest.fn(),
}))

describe('processWeather', () => {
  test('does not water plants when there is no precipitation', () => {
    // @ts-expect-error - Mock function type assertion
    shouldPrecipitateToday.mockReturnValue(false)

    const state = processWeather(
      testState({
        field: [[testCrop()]],
        newDayNotifications: [],
      })
    )

    expect(state.field[0][0]?.wasWateredToday).toBe(false)
  })

  test('does water plants on a rainy day', () => {
    // @ts-expect-error - Mock function type assertion
    shouldPrecipitateToday.mockReturnValue(true)

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
