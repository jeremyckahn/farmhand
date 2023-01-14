import { farmProductsSold } from './farmProductsSold'

/**
 * @param {number} farmProductsSold
 * @returns {number}
 */
export function levelAchieved({
  itemsSold,
  experience,
  features = {},
  useLegacyLevelingSystem = true,
}) {
  if (features.EXPERIENCE && !useLegacyLevelingSystem) {
    return Math.floor(Math.sqrt(experience) / 10) + 1
  }

  return Math.floor(Math.sqrt(farmProductsSold(itemsSold)) / 10) + 1
}
