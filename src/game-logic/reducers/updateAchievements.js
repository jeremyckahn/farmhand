import achievements from '../../data/achievements.js'
import { ACHIEVEMENT_COMPLETED } from '../../templates.js'

import { showNotification } from './showNotification.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {farmhand.state}
 */
export const updateAchievements = (state, prevState) =>
  achievements.reduce((state, achievement) => {
    if (
      !state.completedAchievements[achievement.id] &&
      achievement.condition(state, prevState)
    ) {
      state = {
        ...achievement.reward(state),
        completedAchievements: {
          ...state.completedAchievements,
          [achievement.id]: true,
        },
      }

      state = showNotification(
        state,
        ACHIEVEMENT_COMPLETED`${achievement}`,
        'success'
      )
    }

    return state
  }, state)
