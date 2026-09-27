import { season } from '../enums.js'

export const getSeasonalDemandStatus = (
  item: farmhand.item,
  currentSeason: season
): 'HIGH' | 'LOW' | null => {
  if (item.highDemandSeasons?.includes(currentSeason)) {
    return 'HIGH'
  }

  if (item.lowDemandSeasons?.includes(currentSeason)) {
    return 'LOW'
  }

  return null
}
