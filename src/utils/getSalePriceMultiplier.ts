import { I_AM_RICH_BONUSES } from '../constants.js'

export const getSalePriceMultiplier = (
  completedAchievements: Partial<Record<string, boolean>> = {}
): number => {
  let salePriceMultiplier = 1

  if (completedAchievements['i-am-rich-3']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[2]
  } else if (completedAchievements['i-am-rich-2']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[1]
  } else if (completedAchievements['i-am-rich-1']) {
    salePriceMultiplier += I_AM_RICH_BONUSES[0]
  }

  return salePriceMultiplier
}
