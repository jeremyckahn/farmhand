import { setWasWatered, updateField } from './helpers.js'

// TODO: Add tests for this reducer

export const waterField = state => ({
  ...state,
  field: updateField(state.field, setWasWatered),
})
