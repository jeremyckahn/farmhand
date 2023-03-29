import { moneyTotal } from '../../utils'
import { PURCHASEABLE_CELLARS } from '../../constants'

/**
 * @param {farmhand.state} state
 * @param {number} cellarId
 * @returns {farmhand.state}
 */
export const purchaseCellar = (state, cellarId) => {
  const { money, purchasedCellar } = state

  if (purchasedCellar >= cellarId) {
    return state
  }

  return {
    purchasedCellar: cellarId,
    money: moneyTotal(money, -PURCHASEABLE_CELLARS.get(cellarId).price),
  }
}
