import { levelAchieved } from '../../utils'

import { processLevelUp } from './processLevelUp'

export const addExperience = (state, amount) => {
  const newExperience = state.experience + amount
  const oldLevel = levelAchieved({ itemsSold: state.itemsSold })

  state = processLevelUp(state, oldLevel)

  return {
    ...state,
    experience: newExperience,
  }
}
