import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.spinachSeed
 * @type {farmhand.item}
 */
export const spinachSeed = crop({
  cropType: cropType.SPINACH,
  cropTimeline: [2, 4],
  growsInto: 'spinach',
  id: 'spinach-seed',
  name: 'Spinach Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.spinach
 * @type {farmhand.item}
 */
// @ts-expect-error
export const spinach = crop({
// @ts-expect-error
  ...fromSeed(spinachSeed, {
    canBeFermented: true,
  }),
  name: 'Spinach',
})
