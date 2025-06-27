import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.potatoSeed
 * @type {farmhand.item}
 */
export const potatoSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.POTATO,
    cropTimeline: [2, 1, 1, 1],
    growsInto: 'potato',
    id: 'potato-seed',
    name: 'Potato Seeds',
    tier: 2,
    type: itemType.CROP,
    value: 10,
  })
)

/**
 * @property farmhand.module:items.potato
 * @type {farmhand.item}
 */
export const potato = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (potatoSeed), {
      canBeFermented: true,
    }),
    name: 'Potato',
  })
)
