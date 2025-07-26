import { toolLevel } from '../../enums.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.toolType} toolType
 * @returns {farmhand.state}
 */
export const unlockTool = (state, toolType) => {
  const { toolLevels } = state

  if (toolLevels[toolType] === toolLevel.UNAVAILABLE) {
    return {
      ...state,
      toolLevels: {
        ...toolLevels,
        [toolType]: toolLevel.DEFAULT,
      },
    }
  }

  return state
}
