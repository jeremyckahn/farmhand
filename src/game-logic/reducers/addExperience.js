import { levelAchieved } from '../../utils/levelAchieved'

import { processLevelUp } from './processLevelUp'

/**
 * @param {farmhand.state} state
 * @param {number} amount
 * @returns {farmhand.state}
 */
export const addExperience = (state, amount) => {
  const newExperience = state.experience + amount
  const oldLevel = levelAchieved({ itemsSold: state.itemsSold })

  state = processLevelUp(state, oldLevel)

  return {
    ...state,
    experience: newExperience,
  }
}
