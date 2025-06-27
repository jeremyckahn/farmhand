import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.spinachSeed
 * @type {farmhand.item}
 */
export const spinachSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.SPINACH,
    cropTimeline: [2, 4],
    growsInto: 'spinach',
    id: 'spinach-seed',
    name: 'Spinach Seed',
    tier: 1,
    type: itemType.CROP,
    value: 10,
  })
)

/**
 * @property farmhand.module:items.spinach
 * @type {farmhand.item}
 */
export const spinach = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (spinachSeed), {
      canBeFermented: true,
    }),
    name: 'Spinach',
  })
)
