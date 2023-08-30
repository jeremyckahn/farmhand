import { farmProductsSold } from './farmProductsSold'

/**
 * @param {{
 *   itemsSold: Record<string, number>,
 *   experience?: number,
 *   features?: { EXPERIENCE?: boolean },
 *   useLegacyLevelingSystem?: boolean,
 * }} props
 * @returns {number}
 */
export function levelAchieved({
  itemsSold,
  experience = 0,
  features = {},
  useLegacyLevelingSystem = true,
}) {
  if (features.EXPERIENCE && !useLegacyLevelingSystem) {
    return Math.floor(Math.sqrt(experience) / 10) + 1
  }

  return Math.floor(Math.sqrt(farmProductsSold(itemsSold)) / 10) + 1
}
