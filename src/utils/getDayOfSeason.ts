import { SEASON_LENGTH_DAYS } from '../constants.js'

// dayCount is 1-indexed (the first day of the game is dayCount === 1, per
// computeStateForNextDay.ts), so it must be shifted to 0-indexed before
// taking the modulus.
export const getDayOfSeason = (dayCount: number): number =>
  ((dayCount - 1) % SEASON_LENGTH_DAYS) + 1
