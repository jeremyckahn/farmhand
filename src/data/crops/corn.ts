import { crop, fromSeed } from '../crop.ts'
import { cropType } from '../../enums.ts'

/**
 * @property farmhand.module:items.cornSeed
 * @type {farmhand.item}
 */
export const cornSeed = crop({
  cropType: cropType.CORN,
  cropTimeline: [3, 1, 1, 1, 2, 2],
  growsInto: 'corn',
  id: 'corn-seed',
  name: 'Corn Kernels',
  tier: 2,
})

/**
 * @property farmhand.module:items.corn
 * @type {farmhand.item}
 */
// @ts-expect-error
export const corn = crop({
  // @ts-expect-error
  ...fromSeed(cornSeed, {
    canBeFermented: true,
  }),
  name: 'Corn',
})
