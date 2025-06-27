import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.soybeanSeed
 * @type {farmhand.item}
 */
export const soybeanSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.SOYBEAN,
    cropTimeline: [3, 1, 1, 1, 2, 2],
    growsInto: 'soybean',
    id: 'soybean-seed',
    name: 'Soybean Seed',
    tier: 2,
    type: itemType.CROP,
    value: 10,
  })
)

/**
 * @property farmhand.module:items.soybean
 * @type {farmhand.item}
 */
export const soybean = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (soybeanSeed), {
      canBeFermented: true,
    }),
    name: 'Soybean',
  })
)
