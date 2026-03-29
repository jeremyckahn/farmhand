import { testState } from '../../test-utils/index.js'

import { updateFinancialRecords } from './updateFinancialRecords.js'

describe('updateFinancialRecords', () => {
  test('updates financial records', () => {
    const {
      historicalDailyLosses,
      historicalDailyRevenue,
      profitabilityStreak,
      record7dayProfitAverage,
      recordProfitabilityStreak,
      recordSingleDayProfit,
      todaysLosses,
      todaysRevenue,
    } = updateFinancialRecords(
      testState({
        historicalDailyLosses: [],
        historicalDailyRevenue: [],
        profitabilityStreak: 0,
        record7dayProfitAverage: 0,
        recordProfitabilityStreak: 0,
        recordSingleDayProfit: 0,
        todaysLosses: -10,
        todaysRevenue: 15,
      })
    )

    expect(historicalDailyLosses).toEqual([-10])
    expect(historicalDailyRevenue).toEqual([15])
    expect(record7dayProfitAverage).toEqual(5 / 7)
    expect(recordSingleDayProfit).toEqual(5)
    expect(profitabilityStreak).toEqual(1)
    expect(recordProfitabilityStreak).toEqual(1)
    expect(todaysLosses).toEqual(0)
    expect(todaysRevenue).toEqual(0)
  })

  test('truncates logs', () => {
    const {
      historicalDailyLosses,
      historicalDailyRevenue,
    } = updateFinancialRecords(
      testState({
        historicalDailyLosses: [-1, -2, -3, -4, -5, -6, -7],
        historicalDailyRevenue: [1, 2, 3, 4, 5, 6, 7],
        todaysLosses: -5,
        todaysRevenue: 10,
      })
    )

    expect(historicalDailyLosses).toEqual([-5, -1, -2, -3, -4, -5, -6])
    expect(historicalDailyRevenue).toEqual([10, 1, 2, 3, 4, 5, 6])
  })

  describe('profitabilityStreak', () => {
    test('unprofitable day resets streak', () => {
      const {
        profitabilityStreak,
        recordProfitabilityStreak,
      } = updateFinancialRecords(
        testState({
          historicalDailyLosses: [],
          historicalDailyRevenue: [],
          profitabilityStreak: 10,
          record7dayProfitAverage: 0,
          recordProfitabilityStreak: 10,
          todaysLosses: -10,
          todaysRevenue: 10,
        })
      )

      expect(profitabilityStreak).toEqual(0)
      expect(recordProfitabilityStreak).toEqual(10)
    })
  })
})
