import { updateField } from './helpers'
import { incrementPlotContentAge } from './incrementPlotContentAge'
import { resetWasWatered } from './helpers'
import { resetWasShoveled } from './resetWasShoveled'

const fieldReducer = (acc, fn) => fn(acc)

const fieldUpdaters = [
  incrementPlotContentAge,
  resetWasWatered,
  resetWasShoveled,
]

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processField = state => ({
  ...state,
  field: updateField(state.field, plotContent =>
    fieldUpdaters.reduce(fieldReducer, plotContent)
  ),
})
