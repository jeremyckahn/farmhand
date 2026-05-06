import { moneyTotal } from '../../utils/index.js'

// TODO: Add tests for this reducer

export const addRevenue = (state: any, revenueToAdd: number): any => {
  const { money, revenue, todaysRevenue } = state

  return {
    ...state,
    money: moneyTotal(money, revenueToAdd),
    revenue: moneyTotal(revenue, revenueToAdd),
    todaysRevenue: moneyTotal(todaysRevenue, revenueToAdd),
  }
}
