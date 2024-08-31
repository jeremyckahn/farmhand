import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const removeFieldPlotAt = (state, x, y) =>
  modifyFieldPlotAt(state, x, y, () => null)
