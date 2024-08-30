import { LEVEL_GAINED_NOTIFICATION } from '../../templates'
import { toolLevel } from '../../enums'
import { experienceNeededForLevel } from '../../utils'

import { processLevelUp } from './processLevelUp'

describe('processLevelUp', () => {
  test('shows notifications for each level gained in the sale', async () => {
    const { todaysNotifications } = processLevelUp(
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
    const { hoveredPlotRangeSize } = processLevelUp(
      {
        experience: experienceNeededForLevel(8),
        hoveredPlotRangeSize: 1,
        selectedItemId: 'sprinkler',
        todaysNotifications: [],
        inventory: [],
        toolLevels: {
          SHOVEL: toolLevel.UNAVAILABLE,
        },
      },
      1
    )

    expect(hoveredPlotRangeSize).toEqual(2)
  })

  test('unlocksTool reward makes tool become available', async () => {
    const newState = processLevelUp(
      {
        experience: experienceNeededForLevel(6),
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
