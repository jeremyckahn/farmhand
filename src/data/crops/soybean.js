import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.soybeanSeed
 * @type {farmhand.item}
 */
export const soybeanSeed = crop({
  cropType: cropType.SOYBEAN,
  cropTimeline: [2, 2],
  growsInto: 'soybean',
  id: 'soybean-seed',
  name: 'Soybean Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.soybean
 * @type {farmhand.item}
 */
export const soybean = crop({
  ...fromSeed(soybeanSeed, {
    canBeFermented: true,
  }),
  name: 'Soybean',
})
