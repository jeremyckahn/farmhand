import { moneyTotal } from '../../utils'
import { PURCHASEABLE_COMPOSTERS } from '../../constants'
import { RECYCLING_AVAILABLE_NOTIFICATION } from '../../strings'

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

  return updateLearnedRecipes(state)
}
