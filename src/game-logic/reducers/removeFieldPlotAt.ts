import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

export const removeFieldPlotAt = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => modifyFieldPlotAt(state, x, y, () => null)
