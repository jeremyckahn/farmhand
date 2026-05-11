import { moneyTotal } from '../../utils/index.js'

// TODO: Add tests for this reducer
export const addRevenue = (
  state: farmhand.state,
  revenueToAdd: number
): farmhand.state => {
  const { money, revenue, todaysRevenue } = state

  return {
    ...state,
    money: moneyTotal(money, revenueToAdd),
    revenue: moneyTotal(revenue, revenueToAdd),
    todaysRevenue: moneyTotal(todaysRevenue, revenueToAdd),
  }
}
