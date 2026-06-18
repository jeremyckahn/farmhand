import { moneyTotal } from './moneyTotal.js'

export const getProfit = (revenue: number, losses: number): number =>
  moneyTotal(revenue, losses)
