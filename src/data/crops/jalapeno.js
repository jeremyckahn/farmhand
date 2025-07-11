import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.jalapenoSeed
 * @type {farmhand.item}
 */
export const jalapenoSeed = crop(
  /** @type {farmhand.item} */ ({
    cropType: cropType.JALAPENO,
    cropTimeline: [3, 2, 2, 1],
    growsInto: 'jalapeno',
    id: 'jalapeno-seed',
    name: 'Jalapeno Seed',
    tier: 6,
  })
)

/**
 * @property farmhand.module:items.jalapeno
 * @type {farmhand.item}
 */
export const jalapeno = crop(
  /** @type {farmhand.item} */ ({
    ...fromSeed(/** @type {farmhand.seedItem} */ (jalapenoSeed), {
      canBeFermented: true,
    }),
    name: 'Jalapeno',
  })
)
