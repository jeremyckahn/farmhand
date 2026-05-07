import { moneyTotal } from '../../utils/index.js'

// TODO: Add tests for this reducer
/**
 * @param state
 * @param revenueToAdd
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
