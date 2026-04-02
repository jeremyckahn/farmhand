import { moneyTotal } from '../../utils/index.tsx'
import { PURCHASEABLE_COMBINES } from '../../constants.ts'

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

  const combine = PURCHASEABLE_COMBINES.get(combineId)
  const price = combine?.price || 0

  return {
    ...state,
    purchasedCombine: combineId,
    money: moneyTotal(money, -price),
  }
}
