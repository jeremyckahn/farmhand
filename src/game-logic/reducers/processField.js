import { updateField, setWasWateredProperty } from './helpers'
import { incrementPlotContentAge } from './incrementPlotContentAge'
import { updatePlotShoveledState } from './updatePlotShoveledState'
import { spawnWeeds } from './spawnWeeds'

const fieldReducer = (acc, fn) => fn(acc)

// TODO: Add tests for this reducer.
/**
 * @param {?farmhand.plotContent} plotContent
 * @returns {?farmhand.plotContent}
 */
const resetWasWatered = plotContent => setWasWateredProperty(plotContent, false)

const fieldUpdaters = [
  incrementPlotContentAge,
  resetWasWatered,
  spawnWeeds,
  updatePlotShoveledState,
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
