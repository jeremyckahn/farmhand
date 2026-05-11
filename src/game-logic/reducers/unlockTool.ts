import { toolLevel } from '../../enums.js'

export const unlockTool = (
  state: farmhand.state,
  toolType: farmhand.toolType
): farmhand.state => {
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
