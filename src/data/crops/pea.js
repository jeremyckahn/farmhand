import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.peaSeed
 * @type {farmhand.item}
 */
export const peaSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.PEA,
    cropTimeline: [2, 3],
    growsInto: 'pea',
    id: 'pea-seed',
    name: 'Pea Seed',
    tier: 5,
    type: itemType.CROP,
  })
)

/**
 * @property farmhand.module:items.pea
 * @type {farmhand.item}
 */
export const pea = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (peaSeed), {
      canBeFermented: true,
    }),
    name: 'Pea',
  })
)
