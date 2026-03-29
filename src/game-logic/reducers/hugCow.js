import { COW_HUG_BENEFIT, MAX_DAILY_COW_HUG_BENEFITS } from '../../constants.js'

import { modifyCow } from './modifyCow.js'

/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const hugCow = (state, cowId) =>
  modifyCow(state, cowId, cow =>
    cow.happinessBoostsToday >= MAX_DAILY_COW_HUG_BENEFITS
      ? cow
      : {
          happiness: Math.min(1, cow.happiness + COW_HUG_BENEFIT),
          happinessBoostsToday: cow.happinessBoostsToday + 1,
        }
  )
