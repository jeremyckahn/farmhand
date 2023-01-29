import { LEVEL_GAINED_NOTIFICATION } from '../../templates'
import { toolLevel } from '../../enums'
import { farmProductSalesVolumeNeededForLevel } from '../../utils'

jest.mock('../../data/achievements')
jest.mock('../../data/maps')
jest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))

describe('processLevelUp', () => {
  test('shows notifications for each level gained in the sale', () => {
    jest.resetModules()
    jest.mock('../../data/levels', () => ({
      levels: [
        {
          playerId: 1,
          unlocksShopItem: 'sample-crop-seeds-1',
        },
      ],
      itemUnlockLevels: {},
    }))
    const { todaysNotifications } = jest.requireActual('./').processLevelUp(
      {
        inventory: [],
        itemsSold: {
          'sample-crop-1': farmProductSalesVolumeNeededForLevel(3),
        },
        todaysNotifications: [],
      },
      1
    )

    expect(todaysNotifications).toEqual([
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
    jest.mock('../../data/levels', () => ({
      levels: [
        {
          playerId: 0,
        },
        {
          playerId: 1,
        },
        {
          playerId: 2,
          increasesSprinklerRange: true,
        },
      ],
      itemUnlockLevels: {},
    }))
    jest.mock('../../constants', () => ({
      INITIAL_SPRINKLER_RANGE: 1,
      SPRINKLER_ITEM_ID: 'sprinkler',
    }))

    const { hoveredPlotRangeSize } = jest.requireActual('./').processLevelUp(
      {
        hoveredPlotRangeSize: 1,
        itemsSold: {
          'sample-crop-1': farmProductSalesVolumeNeededForLevel(2),
        },
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
          playerId: 0,
        },
        {
          playerId: 1,
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
