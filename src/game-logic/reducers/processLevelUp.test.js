import { LEVEL_GAINED_NOTIFICATION } from '../../templates'
import { toolLevel } from '../../enums'
import { experienceNeededForLevel } from '../../utils'

jest.mock('../../data/achievements')
jest.mock('../../data/maps')
jest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))

describe('processLevelUp', () => {
  test('shows notifications for each level gained in the sale', () => {
    jest.resetModules()
    jest.mock('../../data/levels', () => ({
      levels: [
        {
          id: 1,
          unlocksShopItem: 'carrot',
        },
      ],
      itemUnlockLevels: {},
    }))
    const { todaysNotifications } = jest.requireActual('./').processLevelUp(
      {
        experience: experienceNeededForLevel(3),
        inventory: [],
        todaysNotifications: [],
      },
      1
    )

    expect(todaysNotifications).toEqual([
      {
        message: LEVEL_GAINED_NOTIFICATION`${3}${{ name: 'Carrot' }}`,
        severity: 'success',
      },
      {
        message: LEVEL_GAINED_NOTIFICATION`${2}${{ name: 'Carrot' }}`,
        severity: 'success',
      },
    ])
  })

  test('when sprinkler is selected when it gets a level up boost, hoveredPlotRangeSize increase', () => {
    jest.resetModules()
    jest.mock('../../data/levels', () => ({
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
    jest.mock('../../constants', () => ({
      ...jest.requireActual('../../constants'),
      INITIAL_SPRINKLER_RANGE: 1,
      SPRINKLER_ITEM_ID: 'sprinkler',
    }))

    const { hoveredPlotRangeSize } = jest.requireActual('./').processLevelUp(
      {
        experience: experienceNeededForLevel(2),
        hoveredPlotRangeSize: 1,
        selectedItemId: 'sprinkler',
        todaysNotifications: [],
      },
      1
    )

    expect(hoveredPlotRangeSize).toEqual(2)
  })

  test('unlocksTool reward makes tool become available', () => {
    jest.resetModules()
    jest.mock('../../data/levels', () => ({
      levels: [
        {
          id: 0,
        },
        {
          id: 1,
          unlocksTool: 'SHOVEL',
        },
      ],
      itemUnlockLevels: {},
    }))
    const newState = jest.requireActual('./').processLevelUp(
      {
        itemsSold: {},
        inventory: [],
        todaysNotifications: [],
        toolLevels: {
          SHOVEL: toolLevel.UNAVAILABLE,
        },
      },
      0
    )

    expect(newState.toolLevels['SHOVEL']).toEqual(toolLevel.DEFAULT)
  })
})
