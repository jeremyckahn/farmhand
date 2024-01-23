/** @typedef {import("../../enums").toolLevel} farmhand.toolLevel */
/** @typedef {import("../../enums").toolType} farmhand.toolType */
/** @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} farmhand.state */

import { toolLevel } from '../../enums'

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
