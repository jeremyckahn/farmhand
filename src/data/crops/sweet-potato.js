import { crop, fromSeed } from '../crop.js'
import { cropType, itemType } from '../../enums.js'

/**
 * @property farmhand.module:items.sweetPotatoSeed
 * @type {farmhand.item}
 */
export const sweetPotatoSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.SWEET_POTATO,
    cropTimeline: [2, 1, 1, 2, 2],
    growsInto: 'sweet-potato',
    id: 'sweet-potato-seed',
    name: 'Sweet Potato Slip',
    tier: 6,
    type: itemType.CROP,
    value: 10,
  })
)

/**
 * @property farmhand.module:items.sweetPotato
 * @type {farmhand.item}
 */
export const sweetPotato = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (sweetPotatoSeed), {
      canBeFermented: true,
    }),
    name: 'Sweet Potato',
  })
)
