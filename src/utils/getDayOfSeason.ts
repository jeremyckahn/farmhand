import { SEASON_LENGTH_DAYS } from '../constants.js'

export const getDayOfSeason = (dayCount: number): number =>
  (dayCount % SEASON_LENGTH_DAYS) + 1
