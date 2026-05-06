import { toolLevel } from '../../enums.js'


export const unlockTool = (state: any, toolType: any): any => {
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
