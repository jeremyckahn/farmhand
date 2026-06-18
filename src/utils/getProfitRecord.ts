import { getProfit } from './getProfit.js'

export const getProfitRecord = (
  recordSingleDayProfit: number,
  todaysRevenue: number,
  todaysLosses: number
): number =>
  Math.max(recordSingleDayProfit, getProfit(todaysRevenue, todaysLosses))
