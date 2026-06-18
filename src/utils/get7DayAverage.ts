import { DAILY_FINANCIAL_HISTORY_RECORD_LENGTH } from '../constants.js'

import { moneyTotal } from './moneyTotal.js'

export const get7DayAverage = (historicalData: Array<number>): number =>
  historicalData.reduce((sum, revenue) => moneyTotal(sum, revenue), 0) /
  DAILY_FINANCIAL_HISTORY_RECORD_LENGTH
