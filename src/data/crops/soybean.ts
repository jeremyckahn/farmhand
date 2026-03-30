import { crop, fromSeed } from '../crop.ts'
import { cropType } from '../../enums.ts'

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
// @ts-expect-error
export const soybean = crop({
  // @ts-expect-error
  ...fromSeed(soybeanSeed, {
    canBeFermented: true,
  }),
  name: 'Soybean',
})
