import { applyChanceEvent } from './helpers'
import { applyCrows } from './applyCrows'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processNerfs = state =>
  applyChanceEvent([[() => true, applyCrows]], state)
