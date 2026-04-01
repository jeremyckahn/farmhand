import achievements from '../../data/achievements.ts'
import { ACHIEVEMENT_COMPLETED } from '../../templates.ts'

import { showNotification } from './showNotification.ts'

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
