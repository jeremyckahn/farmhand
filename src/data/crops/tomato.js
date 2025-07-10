import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.tomatoSeed
 * @type {farmhand.item}
 */
export const tomatoSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.TOMATO,
    cropTimeline: [2, 1, 1, 1, 2, 2, 2],
    growsInto: 'tomato',
    id: 'tomato-seed',
    name: 'Tomato Seeds',
    tier: 3,
    type: itemType.CROP,
  })
)

/**
 * @property farmhand.module:items.tomato
 * @type {farmhand.item}
 */
export const tomato = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (tomatoSeed), {
      canBeFermented: true,
    }),
    name: 'Tomato',
  })
)
