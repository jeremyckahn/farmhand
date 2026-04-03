import { toolLevel, toolType } from '../../enums.js'
import { testState } from '../../test-utils/index.js'

import { unlockTool } from './unlockTool.js'

describe('unlockTool', () => {
  it('unlocks the specified tool', () => {
    const state = testState({
      toolLevels: {
        [toolType.HOE]: toolLevel.DEFAULT,
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
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.SCYTHE]: toolLevel.GOLD,
        [toolType.WATERING_CAN]: toolLevel.DEFAULT,
      },
    })

    const { toolLevels } = unlockTool(state, toolType.SHOVEL)

    expect(toolLevels).toMatchInlineSnapshot(`
      {
        "HOE": "DEFAULT",
        "SCYTHE": "GOLD",
        "SHOVEL": "DEFAULT",
        "WATERING_CAN": "DEFAULT",
      }
    `)
  })
})
