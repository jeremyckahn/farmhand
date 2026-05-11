import { updateField, setWasWateredProperty } from './helpers.js'
import { incrementPlotContentAge } from './incrementPlotContentAge.js'
import { updatePlotShoveledState } from './updatePlotShoveledState.js'
import { spawnWeeds } from './spawnWeeds.js'

const fieldReducer = (acc, fn) => fn(acc)

// TODO: Add tests for this reducer.
const resetWasWatered = (
  plotContent: farmhand.plotContent | null
): farmhand.plotContent | null => setWasWateredProperty(plotContent, false)

const fieldUpdaters = [
  incrementPlotContentAge,
  resetWasWatered,
  spawnWeeds,
  updatePlotShoveledState,
]

export const processField = (state: farmhand.state): farmhand.state => ({
  ...state,
  field: updateField(state.field, plotContent =>
    fieldUpdaters.reduce(fieldReducer, plotContent)
  ) as any,
})
