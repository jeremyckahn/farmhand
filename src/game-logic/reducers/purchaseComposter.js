import { moneyTotal } from '../../utils'
import { EXPERIENCE_VALUES, PURCHASEABLE_COMPOSTERS } from '../../constants'
import { RECYCLING_AVAILABLE_NOTIFICATION } from '../../strings'

import { addExperience } from './addExperience'
import { showNotification } from './showNotification'
import { updateLearnedRecipes } from './updateLearnedRecipes'

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
