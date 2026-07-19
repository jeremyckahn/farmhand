import { LEVEL_GAINED_NOTIFICATION } from '../../templates.js'
import { toolLevel, toolType } from '../../enums.js'
import { experienceNeededForLevel } from '../../utils/experienceNeededForLevel.js'
import { testItem, testState } from '../../test-utils/index.js'

import { processLevelUp } from './processLevelUp.js'

// The Forest, and its Axe/Picker Pole unlocks, are gated behind this
// feature flag (see data/levels.ts) - force it on so level 15 actually
// carries its unlocksTool payload in these tests.
vitest.mock('../../config.js', () => ({ features: { FOREST: true } }))

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
        message: LEVEL_GAINED_NOTIFICATION(
          '',
          3,
          testItem({ id: 'carrot' }) as any
        ),
        severity: 'success',
      },
      {
        message: LEVEL_GAINED_NOTIFICATION(
          '',
          2,
          testItem({ id: 'carrot' }) as any
        ),
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
          [toolType.AXE]: toolLevel.UNAVAILABLE,
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
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
          [toolType.AXE]: toolLevel.UNAVAILABLE,
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      }),
      0
    )

    expect(newState.toolLevels['SHOVEL']).toEqual(toolLevel.DEFAULT)
  })

  test('a single level can unlock multiple tools at once', async () => {
    const newState = processLevelUp(
      testState({
        experience: experienceNeededForLevel(15),
        itemsSold: {},
        inventory: [],
        todaysNotifications: [],
        toolLevels: {
          [toolType.AXE]: toolLevel.UNAVAILABLE,
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      }),
      14
    )

    expect(newState.toolLevels[toolType.AXE]).toEqual(toolLevel.DEFAULT)
    expect(newState.toolLevels[toolType.PICKER_POLE]).toEqual(toolLevel.DEFAULT)
  })
})
