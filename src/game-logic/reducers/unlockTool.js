/** @typedef {toolLevel} farmhand.toolLevel */
/** @typedef {toolType} farmhand.toolType */

import { toolLevel } from '../../enums.js'

/**
 * @param {Object.<farmhand.toolType, farmhand.toolLevel>} toolLevels
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
