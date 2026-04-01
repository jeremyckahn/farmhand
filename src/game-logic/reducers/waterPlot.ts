import { getPlotContentType } from '../../utils/index.tsx'
import { itemType } from '../../enums.ts'

import { modifyFieldPlotAt } from './modifyFieldPlotAt.ts'

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

  return modifyFieldPlotAt(state, x, y, crop => {
    if (!crop) {
      return crop
    }

    return {
      ...crop,
      wasWateredToday: true,
    }
  })
}
