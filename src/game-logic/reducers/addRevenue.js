import { moneyTotal } from '../../utils'

// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {number} revenue
 * @returns {farmhand.state}
 */
export const addRevenue = (state, revenueToAdd) => {
  const { money, revenue, todaysRevenue } = state

  return {
    ...state,
    money: moneyTotal(money, revenueToAdd),
    revenue: moneyTotal(revenue, revenueToAdd),
    todaysRevenue: moneyTotal(todaysRevenue, revenueToAdd),
  }
}
