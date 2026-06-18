import { cropLifeStage } from '../enums.js'
import { itemsMap } from '../data/maps.js'

import { getLifeStageRange } from './getLifeStageRange.js'
import { GROWN } from './cropLifeStageConstants.js'

export const getCropLifeStage = (
  crop: farmhand.crop
): farmhand.cropLifeStage => {
  const { itemId, daysWatered = 0 } = crop
  const { cropTimeline } = itemsMap[itemId]

  if (!cropTimeline) {
    throw new Error(`${itemId} has no cropTimeline`)
  }

  return getLifeStageRange(cropTimeline)[Math.floor(daysWatered)] || GROWN
}
