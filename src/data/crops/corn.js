/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropType } from '../../enums'

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
export const corn = crop({
  ...fromSeed(cornSeed, { canBeFermented: true }),
  name: 'Corn',
})
