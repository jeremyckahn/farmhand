import { moneyTotal } from '../../utils/index.js'
import { EXPERIENCE_VALUES, PURCHASEABLE_COMPOSTERS } from '../../constants.js'
import { RECYCLING_AVAILABLE_NOTIFICATION } from '../../strings.js'

import { addExperience } from './addExperience.js'
import { showNotification } from './showNotification.js'
import { updateLearnedRecipes } from './updateLearnedRecipes.js'

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
    money: moneyTotal(money, -PURCHASEABLE_COMPOSTERS.get(composterId).price),
  }

  state = showNotification(state, RECYCLING_AVAILABLE_NOTIFICATION)
  state = addExperience(state, EXPERIENCE_VALUES.COMPOSTER_ACQUIRED)

  return updateLearnedRecipes(state)
}
