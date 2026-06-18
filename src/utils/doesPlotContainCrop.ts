import { itemType } from '../enums.js'

import { getPlotContentType } from './getPlotContentType.js'

export const doesPlotContainCrop = (
  plot: farmhand.plotContent | null
): plot is farmhand.crop =>
  plot !== null && getPlotContentType(plot) === itemType.CROP
