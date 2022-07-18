import { moneyTotal } from '../../utils'
import { PURCHASEABLE_SMELTERS } from '../../constants'
import { FORGE_AVAILABLE_NOTIFICATION } from '../../strings'

import { showNotification } from './showNotification'
import { updateLearnedRecipes } from './updateLearnedRecipes'

/**
 * @param {farmhand.state} state
 * @param {number} smelterId
 * @returns {farmhand.state}
 */
export const purchaseSmelter = (state, smelterId) => {
  const { money, purchasedSmelter } = state

  if (purchasedSmelter >= smelterId) return state

  state = {
    ...state,
    purchasedSmelter: smelterId,
    money: moneyTotal(money, -PURCHASEABLE_SMELTERS.get(smelterId).price),
  }

  state = showNotification(state, FORGE_AVAILABLE_NOTIFICATION)

  return updateLearnedRecipes(state)
}
