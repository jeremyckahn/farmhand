import { updateField } from './helpers'
import { setWasWatered } from './field'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterField = state => ({
  ...state,
  field: updateField(state.field, setWasWatered),
})
