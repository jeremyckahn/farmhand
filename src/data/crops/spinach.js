/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropType } from '../../enums'

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
export const spinach = crop({
  ...fromSeed(spinachSeed, { canBeFermented: true }),
  name: 'Spinach',
})
