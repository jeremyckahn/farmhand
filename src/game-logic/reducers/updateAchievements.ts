import achievements from '../../data/achievements.js'
import { ACHIEVEMENT_COMPLETED } from '../../templates.js'

import { showNotification } from './showNotification.js'

/**
 * @param {farmhand.state} state
 * @param {farmhand.state} prevState
 * @returns {farmhand.state}
 */
export const updateAchievements = (state, prevState) =>
  achievements.reduce(
    (
      reducerState: farmhand.state,
      achievement: Omit<typeof achievements[number], 'condition'> & {
        condition: (s: farmhand.state, ps: farmhand.state) => boolean
      }
    ) => {
      if (
        !reducerState.completedAchievements[achievement.id] &&
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
    },
    state
  )
