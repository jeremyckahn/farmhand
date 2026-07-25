import { itemsMap } from '../data/maps.js'
import { LARGEST_PURCHASABLE_FIELD_SIZE } from '../constants.js'

import { memoize } from './memoize.js'
import { getGrowingPhaseForTimeline } from './getGrowingPhaseForTimeline.js'

export const getGrowingPhase = memoize(
  (crop: farmhand.crop) => {
    const { itemId, daysWatered = 0 } = crop
    const { cropTimeline = [] } = itemsMap[itemId]

    return getGrowingPhaseForTimeline(cropTimeline, daysWatered)
  },
  {
    cacheSize:
      (LARGEST_PURCHASABLE_FIELD_SIZE as { columns: number }).columns *
      (LARGEST_PURCHASABLE_FIELD_SIZE as { rows: number }).rows,
  }
)
