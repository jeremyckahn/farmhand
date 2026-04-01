import { moneyTotal } from '../../utils/index.tsx'
import { EXPERIENCE_VALUES, PURCHASEABLE_COMPOSTERS } from '../../constants.ts'
import { RECYCLING_AVAILABLE_NOTIFICATION } from '../../strings.ts'

import { addExperience } from './addExperience.ts'
import { showNotification } from './showNotification.ts'
import { updateLearnedRecipes } from './updateLearnedRecipes.ts'

/**
 * @param {farmhand.state} state
 * @param {number} composterId
 * @returns {farmhand.state}
 */
export const purchaseComposter = (state, composterId) => {
  const { money, purchasedComposter } = state

  if (purchasedComposter >= composterId) return state

  state = {
    ...state,
    purchasedComposter: composterId,
    money: moneyTotal(
      money,
      -(PURCHASEABLE_COMPOSTERS.get(composterId)?.price ?? 0)
    ),
  }

  state = showNotification(state, RECYCLING_AVAILABLE_NOTIFICATION)
  state = addExperience(state, EXPERIENCE_VALUES.COMPOSTER_ACQUIRED)

  return updateLearnedRecipes(state)
}
