import { toolLevel, toolType } from '../../enums'

import { unlockTool } from './unlockTool'

describe('unlockTool', () => {
  it('unlocks the specified tool', () => {
    const state = {
      toolLevels: {
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
      },
    }

    const { toolLevels } = unlockTool(state, toolType.SHOVEL)

    expect(toolLevels[toolType.SHOVEL]).toEqual(toolLevel.DEFAULT)
  })

  it('does not alter the rest of the tools', () => {
    const state = {
      toolLevels: {
        [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.SCYTHE]: toolLevel.GOLD,
      },
    }

    const { toolLevels } = unlockTool(state, toolType.SHOVEL)

    expect(toolLevels).toMatchInlineSnapshot(`
      Object {
        "HOE": "DEFAULT",
        "SCYTHE": "GOLD",
        "SHOVEL": "DEFAULT",
      }
    `)
  })
})
