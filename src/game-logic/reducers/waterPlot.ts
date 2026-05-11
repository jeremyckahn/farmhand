import { getPlotContentType } from '../../utils/index.js'
import { itemType } from '../../enums.js'

import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

export const waterPlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
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
