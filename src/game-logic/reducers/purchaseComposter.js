import { moneyTotal } from '../../utils'
import { PURCHASEABLE_COMPOSTERS } from '../../constants'
//import { COMPOSTER_AVAILABLE_NOTIFICATION } from '../../strings'

//import { showNotification } from './showNotification'
import { updateLearnedRecipes } from './updateLearnedRecipes'

// TODO: Add tests for this reducer
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

  //state = showNotification(state, COMPOSTER_AVAILABLE_NOTIFICATION)

  return updateLearnedRecipes(state)
}
