

import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.oliveSeed
 * @type {farmhand.item}
 */
export const oliveSeed = crop(/** @type {farmhand.item} */ ({
  cropType: cropType.OLIVE,
  cropTimeline: [3, 6],
  growsInto: 'olive',
  id: 'olive-seed',
  name: 'Olive Seed',
  tier: 6,
}))

/**
 * @property farmhand.module:items.olive
 * @type {farmhand.item}
 */
export const olive = crop(/** @type {farmhand.item} */ ({
  ...fromSeed(oliveSeed, { canBeFermented: true }),
  name: 'Olive',
}))
