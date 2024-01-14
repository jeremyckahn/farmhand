/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.sunflowerSeed
 * @type {farmhand.item}
 */
export const sunflowerSeed = crop({
  cropType: cropType.SUNFLOWER,
  cropTimetable: {
    [SEED]: 1,
    [GROWING]: [1, 1, 1, 1, 1],
  },
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
  ...fromSeed(sunflowerSeed, { canBeFermented: true }),
  name: 'Sunflower',
})
