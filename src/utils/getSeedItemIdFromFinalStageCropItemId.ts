import { itemsMap } from '../data/maps.js'

import { memoize } from './memoize.js'

export const getSeedItemIdFromFinalStageCropItemId = memoize(
  (cropItemId: string) => {
    const seedItemId = Object.values(
      itemsMap as Record<string, { id?: string; growsInto?: string | string[] }>
    ).find(item => {
      const { growsInto } = item as { growsInto?: string | string[] }

      if (Array.isArray(growsInto)) {
        return growsInto.includes(cropItemId)
      } else {
        return growsInto === cropItemId
      }
    })?.id

    if (!seedItemId)
      throw new Error(
        `Crop item ID ${cropItemId} does not have a corresponding seed`
      )

    return seedItemId
  },
  {
    cacheSize: Object.keys(itemsMap).length,
  }
)
