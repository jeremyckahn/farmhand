import { setWasWatered, updateField } from './helpers'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterField = state => ({
  ...state,
  field: updateField(state.field, setWasWatered),
})
