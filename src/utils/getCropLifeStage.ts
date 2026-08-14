import { cropLifeStage } from '../enums.js'
import { itemsMap } from '../data/maps.js'

import { getLifeStageRange } from './getLifeStageRange.js'

const { SEED, GROWING, GROWN } = cropLifeStage

export const getCropLifeStage = (crop: farmhand.crop): cropLifeStage => {
  const { itemId, daysWatered = 0 } = crop
  const { cropTimeline } = itemsMap[itemId]

  if (!cropTimeline) {
    throw new Error(`${itemId} has no cropTimeline`)
  }

  return getLifeStageRange(cropTimeline)[Math.floor(daysWatered)] || GROWN
}
