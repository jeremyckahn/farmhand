import achievements from '../../data/achievements'
import { ACHIEVEMENT_COMPLETED } from '../../templates'

import { showNotification } from './showNotification'

/**
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {farmhand.state}
 */
export const updateAchievements = (state, prevState) =>
  achievements.reduce((state, achievement) => {
    if (
      !state.completedAchievements[achievement.playerId] &&
      achievement.condition(state, prevState)
    ) {
      state = {
        ...achievement.reward(state),
        completedAchievements: {
          ...state.completedAchievements,
          [achievement.playerId]: true,
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
