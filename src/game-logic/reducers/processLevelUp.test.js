import { LEVEL_GAINED_NOTIFICATION } from '../../templates'
import { toolLevel } from '../../enums'
import { experienceNeededForLevel } from '../../utils'

vitest.mock('../../data/achievements')
vitest.mock('../../data/maps')
vitest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))

describe('processLevelUp', () => {
  test('shows notifications for each level gained in the sale', async () => {
    vitest.resetModules()
    vitest.mock('../../data/levels', () => ({
      levels: [
        {
          id: 1,
          unlocksShopItem: 'carrot',
        },
      ],
      itemUnlockLevels: {},
    }))
    const { todaysNotifications } = (
      await vitest.importActual('./')
    ).processLevelUp(
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

  test('when sprinkler is selected when it gets a level up boost, hoveredPlotRangeSize increase', async () => {
    vitest.resetModules()
    vitest.mock('../../data/levels', () => ({
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
    vitest.mock('../../constants', async importOriginal => ({
      ...(await importOriginal()),
      ...(await vitest.importActual('../../constants')),
      INITIAL_SPRINKLER_RANGE: 1,
      SPRINKLER_ITEM_ID: 'sprinkler',
    }))

    const { hoveredPlotRangeSize } = (
      await vitest.importActual('./')
    ).processLevelUp(
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

  test('unlocksTool reward makes tool become available', async () => {
    vitest.resetModules()
    vitest.mock('../../data/levels', () => ({
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
    const newState = (await vitest.importActual('./')).processLevelUp(
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
