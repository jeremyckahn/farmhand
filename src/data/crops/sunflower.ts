import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.sunflowerSeed
 */
export const sunflowerSeed: farmhand.item = crop({
  cropType: cropType.SUNFLOWER,
  cropTimeline: [1, 1, 1, 1, 1, 1],
  growsInto: 'sunflower',
  id: 'sunflower-seed',
  name: 'Sunflower Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.sunflower
 */
export const sunflower: farmhand.item = crop({
  ...fromSeed(sunflowerSeed, {
    canBeFermented: true,
  }),
  name: 'Sunflower',
})
