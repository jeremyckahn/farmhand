import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.cornSeed
 */
export const cornSeed: farmhand.item = crop({
  cropType: cropType.CORN,
  cropTimeline: [3, 1, 1, 1, 2, 2],
  growsInto: 'corn',
  id: 'corn-seed',
  name: 'Corn Kernels',
  tier: 2,
})

/**
 * @property farmhand.module:items.corn
 */
export const corn: farmhand.item = crop({
  ...fromSeed(cornSeed, {
    canBeFermented: true,
  }),
  name: 'Corn',
})
