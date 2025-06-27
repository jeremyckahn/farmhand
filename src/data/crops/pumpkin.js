import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.PUMPKIN,
    cropTimeline: [3, 1, 1, 1, 1, 1],
    growsInto: 'pumpkin',
    id: 'pumpkin-seed',
    name: 'Pumpkin Seed',
    tier: 1,
    type: itemType.CROP,
    value: 10,
  })
)

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const pumpkin = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (pumpkinSeed), {
      canBeFermented: true,
    }),
    name: 'Pumpkin',
  })
)
