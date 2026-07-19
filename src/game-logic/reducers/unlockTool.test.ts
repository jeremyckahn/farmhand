import { toolLevel, toolType } from '../../enums.js'
import { testState } from '../../test-utils/index.js'

import { unlockTool } from './unlockTool.js'

describe('unlockTool', () => {
  it('unlocks the specified tool', () => {
    const state = testState({
      toolLevels: {
        [toolType.AXE]: toolLevel.UNAVAILABLE,
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
        [toolType.SCYTHE]: toolLevel.DEFAULT,
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
        [toolType.WATERING_CAN]: toolLevel.DEFAULT,
      },
    })

    const { toolLevels } = unlockTool(state, toolType.SHOVEL)

    expect(toolLevels[toolType.SHOVEL]).toEqual(toolLevel.DEFAULT)
  })

  it('does not alter the rest of the tools', () => {
    const state = testState({
      toolLevels: {
        [toolType.AXE]: toolLevel.UNAVAILABLE,
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
        [toolType.SCYTHE]: toolLevel.GOLD,
        [toolType.WATERING_CAN]: toolLevel.DEFAULT,
      },
    })

    const { toolLevels } = unlockTool(state, toolType.SHOVEL)

    expect(toolLevels).toMatchInlineSnapshot(`
      {
        "AXE": "UNAVAILABLE",
        "HOE": "DEFAULT",
        "PICKER_POLE": "UNAVAILABLE",
        "SCYTHE": "GOLD",
        "SHOVEL": "DEFAULT",
        "WATERING_CAN": "DEFAULT",
      }
    `)
  })

  it('unlocks the axe', () => {
    const state = testState({
      toolLevels: {
        [toolType.AXE]: toolLevel.UNAVAILABLE,
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
        [toolType.SCYTHE]: toolLevel.DEFAULT,
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
        [toolType.WATERING_CAN]: toolLevel.DEFAULT,
      },
    })

    const { toolLevels } = unlockTool(state, toolType.AXE)

    expect(toolLevels[toolType.AXE]).toEqual(toolLevel.DEFAULT)
  })

  it('unlocks the picker pole', () => {
    const state = testState({
      toolLevels: {
        [toolType.AXE]: toolLevel.UNAVAILABLE,
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.PICKER_POLE]: toolLevel.UNAVAILABLE,
        [toolType.SCYTHE]: toolLevel.DEFAULT,
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
        [toolType.WATERING_CAN]: toolLevel.DEFAULT,
      },
    })

    const { toolLevels } = unlockTool(state, toolType.PICKER_POLE)

    expect(toolLevels[toolType.PICKER_POLE]).toEqual(toolLevel.DEFAULT)
  })
})
