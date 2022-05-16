import { setWasWatered, updateField } from './helpers'

// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterField = state => ({
  ...state,
  field: updateField(state.field, setWasWatered),
})
