import { LEVEL_GAINED_NOTIFICATION } from '../../templates.js'
import { toolLevel, toolType } from '../../enums.js'
import { experienceNeededForLevel } from '../../utils/index.js'
import { testItem, testState } from '../../test-utils/index.js'

import { processLevelUp } from './processLevelUp.js'

describe('processLevelUp', () => {
  test('shows notifications for each level gained in the sale', async () => {
    const { todaysNotifications } = processLevelUp(
      testState({
        experience: experienceNeededForLevel(3),
        inventory: [],
        todaysNotifications: [],
      }),
      1
    )

    expect(todaysNotifications).toEqual([
      {
        message: LEVEL_GAINED_NOTIFICATION('', 3, testItem({ id: 'carrot' })),
        severity: 'success',
      },
      {
        message: LEVEL_GAINED_NOTIFICATION('', 2, testItem({ id: 'carrot' })),
        severity: 'success',
      },
    ])
  })

  test('when sprinkler is selected when it gets a level up boost, hoveredPlotRangeSize increase', async () => {
    const { hoveredPlotRangeSize } = processLevelUp(
      testState({
        experience: experienceNeededForLevel(8),
        hoveredPlotRangeSize: 1,
        selectedItemId: 'sprinkler',
        todaysNotifications: [],
        inventory: [],
        toolLevels: {
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      }),
      1
    )

    expect(hoveredPlotRangeSize).toEqual(2)
  })

  test('unlocksTool reward makes tool become available', async () => {
    const newState = processLevelUp(
      testState({
        experience: experienceNeededForLevel(6),
        itemsSold: {},
        inventory: [],
        todaysNotifications: [],
        toolLevels: {
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      }),
      0
    )

    expect(newState.toolLevels['SHOVEL']).toEqual(toolLevel.DEFAULT)
  })
})
