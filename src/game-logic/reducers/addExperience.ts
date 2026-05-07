import { levelAchieved } from '../../utils/levelAchieved.js'

import { processLevelUp } from './processLevelUp.js'

/**
 * @param state
 * @param amount
 * @returns {farmhand.state}
 */
export const addExperience = (state, amount) => {
  const { experience } = state
  const oldLevel = levelAchieved(experience)

  let newState = {
    ...state,
    experience: experience + amount,
  }

  newState = processLevelUp(newState, oldLevel)

  return newState
}
