import { levelAchieved } from '../../utils/levelAchieved.js'

import { processLevelUp } from './processLevelUp.js'


export const addExperience = (state: any, amount: number): any => {
  const { experience } = state
  const oldLevel = levelAchieved(experience)

  let newState = {
    ...state,
    experience: experience + amount,
  }

  newState = processLevelUp(newState, oldLevel)

  return newState
}
