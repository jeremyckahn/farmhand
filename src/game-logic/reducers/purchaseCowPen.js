/**
 * @typedef {import("../../components/Farmhand/Farmhand").farmhand.state} state
 */
import { moneyTotal } from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { COW_PEN_PURCHASED } from '../../templates'

import { showNotification } from './showNotification'

/**
 * @param {state} state
 * @param {number} cowPenId
 * @returns {state}
 */
export const purchaseCowPen = (state, cowPenId) => {
  const { money, purchasedCowPen } = state

  if (purchasedCowPen >= cowPenId) {
    return state
  }

  const { cows, price } = PURCHASEABLE_COW_PENS.get(cowPenId)

  state = showNotification(state, COW_PEN_PURCHASED`${cows}`, 'success')

  return {
    ...state,
    purchasedCowPen: cowPenId,
    money: moneyTotal(money, -price),
  }
}
