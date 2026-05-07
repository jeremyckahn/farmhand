import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

/**
 * @param state
 * @param x
 * @param y
 * @returns {farmhand.state}
 */
export const removeFieldPlotAt = (state, x, y) =>
  modifyFieldPlotAt(state, x, y, () => null)
