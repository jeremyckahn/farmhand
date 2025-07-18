import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.sunflowerSeed
 * @type {farmhand.item}
 */
export const sunflowerSeed = crop({
  cropType: cropType.SUNFLOWER,
  cropTimeline: [1, 1, 1, 1, 1, 1],
  growsInto: 'sunflower',
  id: 'sunflower-seed',
  name: 'Sunflower Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.sunflower
 * @type {farmhand.item}
 */
export const sunflower = crop({
  ...fromSeed(sunflowerSeed, {
    canBeFermented: true,
  }),
  name: 'Sunflower',
})
