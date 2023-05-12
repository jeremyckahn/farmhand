import { generateCow } from '../../utils'
import { generateValueAdjustments } from '../../common/utils'

import { applyLoanInterest } from './applyLoanInterest'
import { computeCowInventoryForNextDay } from './computeCowInventoryForNextDay'
import { generatePriceEvents } from './generatePriceEvents'
import { processCellar } from './processCellar'
import { processCowAttrition } from './processCowAttrition'
import { processCowBreeding } from './processCowBreeding'
import { processCowFertilizerProduction } from './processCowFertilizerProduction'
import { processFeedingCows } from './processFeedingCows'
import { processField } from './processField'
import { processMilkingCows } from './processMilkingCows'
import { processNerfs } from './processNerfs'
import { processSprinklers } from './processSprinklers'
import { processWeather } from './processWeather'
import { rotateNotificationLogs } from './rotateNotificationLogs'
import { updateFinancialRecords } from './updateFinancialRecords'
import { updateInventoryRecordsForNextDay } from './updateInventoryRecordsForNextDay'
import { updatePriceEvents } from './updatePriceEvents'

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

// FIXME: Process cellar kegs
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
        processCellar,
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
