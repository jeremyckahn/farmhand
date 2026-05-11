import { setWasWatered, updateField } from './helpers.js'

// TODO: Add tests for this reducer
export const waterField = (state: farmhand.state): farmhand.state => ({
  ...state,
  field: updateField(state.field!, setWasWatered) as any,
})
