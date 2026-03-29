import achievements from '../../data/achievements.js'
import { ACHIEVEMENT_COMPLETED } from '../../templates.js'

import { showNotification } from './showNotification.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {farmhand.state}
 */
export const updateAchievements = (state, prevState) =>
  achievements.reduce((reducerState, achievement) => {
    if (
      !reducerState.completedAchievements[achievement.id] &&
// @ts-expect-error
      achievement.condition(reducerState, prevState)
    ) {
      reducerState = {
        ...achievement.reward(reducerState),
        completedAchievements: {
          ...reducerState.completedAchievements,
          [achievement.id]: true,
        },
      }

      reducerState = showNotification(
        reducerState,
        ACHIEVEMENT_COMPLETED('', {
          name: achievement.name,
          rewardDescription: achievement.rewardDescription,
        }),
        'success'
      )
    }

    return reducerState
  }, state)
