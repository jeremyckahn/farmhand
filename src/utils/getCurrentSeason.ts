import { season } from '../enums.js'
import { SEASON_ORDER } from '../data/seasons.js'
import { SEASON_LENGTH_DAYS } from '../constants.js'

// dayCount is 1-indexed (the first day of the game is dayCount === 1, per
// computeStateForNextDay.ts), so it must be shifted to 0-indexed before
// dividing into season-length chunks.
export const getCurrentSeason = (dayCount: number): season =>
  SEASON_ORDER[
    Math.floor((dayCount - 1) / SEASON_LENGTH_DAYS) % SEASON_ORDER.length
  ]
