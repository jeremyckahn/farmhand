import { generateCow } from '../../utils/index.js'
import { generateValueAdjustments } from '../../common/utils.js'
import { EXPERIENCE_VALUES } from '../../constants.js'

import { addExperience } from './addExperience.js'
import { applyLoanInterest } from './applyLoanInterest.js'
import { computeCowInventoryForNextDay } from './computeCowInventoryForNextDay.js'
import { generatePriceEvents } from './generatePriceEvents.js'
import { processCellar } from './processCellar.js'
import { processCowAttrition } from './processCowAttrition.js'
import { processCowBreeding } from './processCowBreeding.js'
import { processCowFertilizerProduction } from './processCowFertilizerProduction.js'
import { processFeedingCows } from './processFeedingCows.js'
import { processField } from './processField.js'
import { processMilkingCows } from './processMilkingCows.js'
import { processNerfs } from './processNerfs.js'
import { processSprinklers } from './processSprinklers.js'
import { processWeather } from './processWeather.js'
import { rotateNotificationLogs } from './rotateNotificationLogs.js'
import { updateFinancialRecords } from './updateFinancialRecords.js'
import { updateInventoryRecordsForNextDay } from './updateInventoryRecordsForNextDay.js'
import { updatePriceEvents } from './updatePriceEvents.js'

const adjustItemValues = (state: farmhand.state): farmhand.state => ({
  ...state,
  historicalValueAdjustments: [state.valueAdjustments],
  valueAdjustments: generateValueAdjustments(
    state.priceCrashes,
    state.priceSurges
  ),
})

export const computeStateForNextDay = (
  state: farmhand.state,
  isFirstDay: boolean = false
): farmhand.state => {
  const reducers: Array<(s: farmhand.state) => farmhand.state> = isFirstDay
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

  state = reducers
    .concat([adjustItemValues])
    .reduce(
      (acc: farmhand.state, fn: (s: farmhand.state) => farmhand.state) =>
        fn({ ...acc }),
      {
        ...state,
        cowForSale: generateCow(),
        dayCount: state.dayCount + 1,
        todaysNotifications: [] as farmhand.notification[],
      }
    )

  if (state.dayCount % 365 === 0) {
    state = addExperience(state, EXPERIENCE_VALUES.NEW_YEAR)
  }

  return state
}
