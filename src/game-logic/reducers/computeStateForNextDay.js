import { generateCow } from '../../utils'

import { processWeather } from './processWeather'
import { processField } from './processField'
import { processSprinklers } from './processSprinklers'
import { processNerfs } from './processNerfs'
import { processFeedingCows } from './processFeedingCows'
import { processCowAttrition } from './processCowAttrition'
import { processMilkingCows } from './processMilkingCows'
import { processCowFertilizerProduction } from './processCowFertilizerProduction'
import { processCowBreeding } from './processCowBreeding'
import { computeCowInventoryForNextDay } from './computeCowInventoryForNextDay'
import { rotateNotificationLogs } from './rotateNotificationLogs'
import { generatePriceEvents } from './generatePriceEvents'
import { updatePriceEvents } from './updatePriceEvents'
import { updateFinancialRecords } from './updateFinancialRecords'
import { updateInventoryRecordsForNextDay } from './updateInventoryRecordsForNextDay'
import { applyLoanInterest } from './applyLoanInterest'

import { adjustItemValues } from './index'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeStateForNextDay = (state, isFirstDay = false) =>
  (isFirstDay
    ? []
    : [
        computeCowInventoryForNextDay,
        processCowBreeding,
        processField,
        processNerfs,
        processWeather,
        processSprinklers,
        processFeedingCows,
        processCowAttrition,
        processMilkingCows,
        processCowFertilizerProduction,
        updatePriceEvents,
        updateFinancialRecords,
        updateInventoryRecordsForNextDay,
        generatePriceEvents,
        applyLoanInterest,
        rotateNotificationLogs,
      ]
  )
    .concat([adjustItemValues])
    .reduce((acc, fn) => fn({ ...acc }), {
      ...state,
      cowForSale: generateCow(),
      dayCount: state.dayCount + 1,
      todaysNotifications: [],
    })
