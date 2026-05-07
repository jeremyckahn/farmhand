import { updateField, setWasWateredProperty } from './helpers.js'
import { incrementPlotContentAge } from './incrementPlotContentAge.js'
import { updatePlotShoveledState } from './updatePlotShoveledState.js'
import { spawnWeeds } from './spawnWeeds.js'

const fieldReducer = (acc, fn) => fn(acc)

// TODO: Add tests for this reducer.
/**
 * @param plotContent
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
 * @param state
 * @returns {farmhand.state}
 */
export const processField = state => ({
  ...state,
  field: updateField(state.field, plotContent =>
    fieldUpdaters.reduce(fieldReducer, plotContent)
  ),
})
