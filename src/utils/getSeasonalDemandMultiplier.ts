import { season } from '../enums.js'
import {
  SEASON_HIGH_DEMAND_BONUS,
  SEASON_LOW_DEMAND_PENALTY,
} from '../constants.js'

import { getSeasonalDemandStatus } from './getSeasonalDemandStatus.js'

export const getSeasonalDemandMultiplier = (
  item: farmhand.item,
  currentSeason: season
): number => {
  const status = getSeasonalDemandStatus(item, currentSeason)

  if (status === 'HIGH') {
    return 1 + SEASON_HIGH_DEMAND_BONUS
  }

  if (status === 'LOW') {
    return 1 - SEASON_LOW_DEMAND_PENALTY
  }

  return 1
}
