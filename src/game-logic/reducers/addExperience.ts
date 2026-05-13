import { levelAchieved } from '../../utils/levelAchieved.js'

import { processLevelUp } from './processLevelUp.js'

export const addExperience = (
  state: farmhand.state,
  amount: number
): farmhand.state => {
  const { experience } = state
  const oldLevel = levelAchieved(experience)

  let newState = {
    ...state,
    experience: experience + amount,
  }

  newState = processLevelUp(newState, oldLevel)

  return newState
}
