import { itemType } from '../enums.js'

import { getPlotContentType } from './getPlotContentType.js'

export const isPlotContentACrop = (
  plotContents: farmhand.plotContent
): plotContents is farmhand.crop =>
  getPlotContentType(plotContents) === itemType.CROP
