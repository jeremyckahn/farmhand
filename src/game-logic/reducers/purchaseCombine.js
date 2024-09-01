import { moneyTotal } from '../../utils/index.js'
import { PURCHASEABLE_COMBINES } from '../../constants.js'

/**
 * @param {farmhand.state} state
 * @param {number} combineId
 * @returns {farmhand.state}
 */
export const purchaseCombine = (state, combineId) => {
  const { money, purchasedCombine } = state

  if (purchasedCombine >= combineId) {
    return state
  }

  return {
    purchasedCombine: combineId,
    money: moneyTotal(money, -PURCHASEABLE_COMBINES.get(combineId).price),
  }
}
