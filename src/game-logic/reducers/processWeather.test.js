import { testCrop } from '../../test-utils'

jest.mock('../../data/maps')

// TODO: Dependency-inject external constants rather than mocking them out.

describe('processWeather', () => {
  test('does not water plants when there is no precipitation', () => {
    jest.resetModules()
    jest.mock('../../constants', () => ({
      PRECIPITATION_CHANCE: 0,
    }))

    const { processWeather } = jest.requireActual('./processWeather')

    const state = processWeather({
      field: [[testCrop()]],
      newDayNotifications: [],
    })

    expect(state.field[0][0].wasWateredToday).toBe(false)
  })

  test('does water plants on a rainy day', () => {
    jest.resetModules()
    jest.mock('../../constants', () => ({
      PRECIPITATION_CHANCE: 1,
    }))

    const { processWeather } = jest.requireActual('./processWeather')

    const state = processWeather({
      field: [[testCrop()]],
      inventory: [],
      newDayNotifications: [],
    })

    expect(state.field[0][0].wasWateredToday).toBe(true)
  })
})
