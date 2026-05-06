import { COW_HUG_BENEFIT, MAX_DAILY_COW_HUG_BENEFITS } from '../../constants.js'

import { modifyCow } from './modifyCow.js'


export const hugCow = (state: any, cowId: string): any =>
  modifyCow(state, cowId, cow =>
    cow.happinessBoostsToday >= MAX_DAILY_COW_HUG_BENEFITS
      ? cow
      : {
          happiness: Math.min(1, cow.happiness + COW_HUG_BENEFIT),
          happinessBoostsToday: cow.happinessBoostsToday + 1,
        }
  )
