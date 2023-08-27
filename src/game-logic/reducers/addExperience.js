import { processLevelUp } from './processLevelUp'

export const addExperience = (state, amount) => {
  const newExperience = state.experience + amount

  state = processLevelUp(state, state.oldLevel)

  return {
    ...state,
    experience: newExperience,
  }
}
