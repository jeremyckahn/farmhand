import { generateCow } from '../../utils'
import { generateValueAdjustments } from '../../common/utils'

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

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
const adjustItemValues = state => ({
  ...state,
  historicalValueAdjustments: [state.valueAdjustments],
  valueAdjustments: generateValueAdjustments(
    state.priceCrashes,
    state.priceSurges
  ),
})

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeStateForNextDay = (state, isFirstDay = false) =>
  (isFirstDay
    ? [processField]
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
