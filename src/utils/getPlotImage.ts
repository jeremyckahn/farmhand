import { cropItemIdToSeedItemMap } from '../data/maps.js'
import { items as itemImages } from '../img/index.js'
import { itemType, cropLifeStage } from '../enums.js'

import { getCropLifeStage } from './getCropLifeStage.js'
import { getGrowingPhase } from './getGrowingPhase.js'
import { getPlotContentType } from './getPlotContentType.js'

const { SEED, GROWING, GROWN } = cropLifeStage

const isPlotContent = (obj: any = {}): obj is farmhand.plotContent =>
  Boolean(obj && obj['itemId'] && obj['fertilizerType'])

const isShoveledPlot = (obj: any = {}): obj is farmhand.shoveledPlot =>
  Boolean(obj && obj['isShoveled'] && obj['daysUntilClear'])

const isPlotContentACrop = (
  plotContents: farmhand.plotContent
): plotContents is farmhand.crop =>
  getPlotContentType(plotContents) === itemType.CROP

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

      return (itemImages as any)[itemImageId]
    }

    if (getPlotContentType(plotContents) === itemType.WEED) {
      const weedColors = ['yellow', 'orange', 'pink']
      // TODO: Handle negative coordinates by using Math.abs(x * y) to avoid
      // negative modulo index.
      const color = weedColors[(x * y) % weedColors.length]

      return (itemImages as any)[`weed-${color}`]
    }

    // Handle other plot content (non-crop, non-weed)
    return (itemImages as any)[(plotContents as farmhand.plotContent).itemId]
  }

  if (isShoveledPlot(plotContents)) {
    if (plotContents?.oreId) {
      return (itemImages as any)[plotContents.oreId]
    }
  }

  return null
}
