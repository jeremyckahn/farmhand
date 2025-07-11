import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.sunflowerSeed
 * @type {farmhand.item}
 */
export const sunflowerSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.SUNFLOWER,
    cropTimeline: [1, 1, 1, 1, 1, 1],
    growsInto: 'sunflower',
    id: 'sunflower-seed',
    name: 'Sunflower Seed',
    tier: 6,
    type: itemType.CROP,
  })
)

/**
 * @property farmhand.module:items.sunflower
 * @type {farmhand.item}
 */
export const sunflower = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (sunflowerSeed), {
      canBeFermented: true,
    }),
    name: 'Sunflower',
  })
)
