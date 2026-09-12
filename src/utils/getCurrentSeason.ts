import { season } from '../enums.js'
import { SEASON_ORDER } from '../data/seasons.js'
import { SEASON_LENGTH_DAYS } from '../constants.js'

export const getCurrentSeason = (dayCount: number): season =>
  SEASON_ORDER[Math.floor(dayCount / SEASON_LENGTH_DAYS) % SEASON_ORDER.length]
