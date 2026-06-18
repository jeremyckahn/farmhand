import { cropItemIdToSeedItemMap } from '../data/maps.js'
import { items as itemImages } from '../img/index.js'
import { itemType } from '../enums.js'

import { isPlotContent } from './isPlotContent.js'
import { isPlotContentACrop } from './isPlotContentACrop.js'
import { getCropLifeStage } from './getCropLifeStage.js'
import { GROWN } from './cropLifeStageConstants.js'
import { GROWING } from './cropLifeStageConstants.js'
import { getGrowingPhase } from './getGrowingPhase.js'
import { getPlotContentType } from './getPlotContentType.js'
import { isShoveledPlot } from './isShoveledPlot.js'

export const getPlotImage = (
  plotContents: farmhand.plotContent | farmhand.shoveledPlot | null,
  x: number,
  y: number
): string | null => {
  if (isPlotContent(plotContents)) {
    if (isPlotContentACrop(plotContents)) {
      let itemImageId
      switch (getCropLifeStage(plotContents)) {
        case GROWN:
          itemImageId = plotContents.itemId
          break

        case GROWING:
          const phase = getGrowingPhase(plotContents)
          itemImageId = `${plotContents.itemId}-growing-${phase}`
          break

        default:
          const seedItem = cropItemIdToSeedItemMap[plotContents.itemId]
          itemImageId = seedItem.id
      }

      return itemImages[itemImageId]
    }

    if (getPlotContentType(plotContents) === itemType.WEED) {
      const weedColors = ['yellow', 'orange', 'pink']
      const color = weedColors[(x * y) % weedColors.length]

      return itemImages[`weed-${color}`]
    }

    // Handle other plot content (non-crop, non-weed)
    return itemImages[(plotContents as farmhand.plotContent).itemId]
  }

  if (isShoveledPlot(plotContents)) {
    if (plotContents?.oreId) {
      return itemImages[plotContents.oreId]
    }
  }

  return null
}
