import { generateCow } from '../../utils/index.tsx'
import { generateValueAdjustments } from '../../common/utils.ts'
import { EXPERIENCE_VALUES } from '../../constants.ts'

import { addExperience } from './addExperience.ts'
import { applyLoanInterest } from './applyLoanInterest.ts'
import { computeCowInventoryForNextDay } from './computeCowInventoryForNextDay.ts'
import { generatePriceEvents } from './generatePriceEvents.ts'
import { processCellar } from './processCellar.ts'
import { processCowAttrition } from './processCowAttrition.ts'
import { processCowBreeding } from './processCowBreeding.ts'
import { processCowFertilizerProduction } from './processCowFertilizerProduction.ts'
import { processFeedingCows } from './processFeedingCows.ts'
import { processField } from './processField.ts'
import { processMilkingCows } from './processMilkingCows.ts'
import { processNerfs } from './processNerfs.ts'
import { processSprinklers } from './processSprinklers.ts'
import { processWeather } from './processWeather.ts'
import { rotateNotificationLogs } from './rotateNotificationLogs.ts'
import { updateFinancialRecords } from './updateFinancialRecords.ts'
import { updateInventoryRecordsForNextDay } from './updateInventoryRecordsForNextDay.ts'
import { updatePriceEvents } from './updatePriceEvents.tsx'

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
export const computeStateForNextDay = (state, isFirstDay = false) => {
  const reducers = isFirstDay
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

  state = reducers.concat([adjustItemValues]).reduce(
    (acc, fn) => fn({ ...acc }),
    /** @type {farmhand.state} */ {
      ...state,
      cowForSale: generateCow(),
      dayCount: state.dayCount + 1,
      todaysNotifications: [],
    }
  )

  if (state.dayCount % 365 === 0) {
    state = addExperience(state, EXPERIENCE_VALUES.NEW_YEAR)
  }

  return state
}
