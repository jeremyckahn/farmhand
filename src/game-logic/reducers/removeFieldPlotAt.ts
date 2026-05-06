import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'


export const removeFieldPlotAt = (state: any, x: number, y: number): any =>
  modifyFieldPlotAt(state, x, y, () => null)
