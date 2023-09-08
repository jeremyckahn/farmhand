import { levelAchieved } from '../../utils/levelAchieved'

import { processLevelUp } from './processLevelUp'

/**
 * @param {farmhand.state} state
 * @param {number} amount
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
