import { get7DayAverage, getProfit, moneyTotal } from '../../utils'
import { DAILY_FINANCIAL_HISTORY_RECORD_LENGTH } from '../../constants'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updateFinancialRecords = state => {
  const {
    profitabilityStreak,
    todaysLosses,
    todaysRevenue,
    record7dayProfitAverage,
    recordProfitabilityStreak,
  } = state
  let {
    historicalDailyLosses,
    historicalDailyRevenue,
    recordSingleDayProfit,
  } = state

  historicalDailyLosses = [todaysLosses, ...historicalDailyLosses].slice(
    0,
    DAILY_FINANCIAL_HISTORY_RECORD_LENGTH
  )

  historicalDailyRevenue = [todaysRevenue, ...historicalDailyRevenue].slice(
    0,
    DAILY_FINANCIAL_HISTORY_RECORD_LENGTH
  )

  const profitAverage = get7DayAverage(
    historicalDailyLosses.map((loss, i) =>
      moneyTotal(historicalDailyRevenue[i], loss)
    )
  )

  const wasTodayProfitable = todaysRevenue + todaysLosses > 0
  const currentProfitabilityStreak = wasTodayProfitable
    ? profitabilityStreak + 1
    : 0

  return {
    ...state,
    historicalDailyLosses,
    historicalDailyRevenue,
    profitabilityStreak: currentProfitabilityStreak,
    record7dayProfitAverage: Math.max(record7dayProfitAverage, profitAverage),
    recordProfitabilityStreak: Math.max(
      recordProfitabilityStreak,
      currentProfitabilityStreak
    ),
    recordSingleDayProfit: Math.max(
      recordSingleDayProfit,
      getProfit(todaysRevenue, todaysLosses)
    ),
    todaysLosses: 0,
    todaysRevenue: 0,
  }
}
