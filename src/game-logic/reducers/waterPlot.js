import { getPlotContentType } from '../../utils'
import { itemType } from '../../enums'

import { modifyFieldPlotAt } from './modifyFieldPlotAt'

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const waterPlot = (state, x, y) => {
  const plotContent = state.field[y][x]

  const canBeWatered =
    plotContent && getPlotContentType(plotContent) === itemType.CROP

  if (!canBeWatered) {
    return state
  }

  return modifyFieldPlotAt(state, x, y, crop => ({
    ...crop,
    wasWateredToday: true,
  }))
}
