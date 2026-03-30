import { applyChanceEvent } from './helpers.tsx'
import { applyCrows } from './applyCrows.ts'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const processNerfs = state =>
  applyChanceEvent([[() => true, applyCrows]], state)
