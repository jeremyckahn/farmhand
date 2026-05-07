import { applyChanceEvent } from './helpers.js'
import { applyCrows } from './applyCrows.js'

/**
 * @param state
 * @returns {farmhand.state}
 */
export const processNerfs = state =>
  applyChanceEvent([[() => true, applyCrows]], state)
