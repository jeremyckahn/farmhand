import { itemsMap } from '../data/maps.js'
import { LARGEST_PURCHASABLE_FIELD_SIZE } from '../constants.js'

import { memoize } from './memoize.js'

export const getGrowingPhase = memoize(
  (crop: farmhand.crop) => {
    const { itemId, daysWatered = 0 } = crop
    const { cropTimeline = [] } = itemsMap[itemId]

    let daysGrowing = daysWatered + 1
    let phase = 0

    for (let value of cropTimeline) {
      if (daysGrowing - value <= 0) break

      daysGrowing -= value
      phase += 1
    }

    return phase
  },
  {
    cacheSize:
      (LARGEST_PURCHASABLE_FIELD_SIZE as { columns: number }).columns *
      (LARGEST_PURCHASABLE_FIELD_SIZE as { rows: number }).rows,
  }
)
