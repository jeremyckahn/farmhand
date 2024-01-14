/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.asparagusSeed
 * @type {farmhand.item}
 */
export const asparagusSeed = crop({
  cropType: cropType.ASPARAGUS,
  cropTimetable: {
    [SEED]: 4,
    [GROWING]: [2, 2, 1],
  },
  growsInto: 'asparagus',
  id: 'asparagus-seed',
  name: 'Asparagus Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.asparagus
 * @type {farmhand.item}
 */
export const asparagus = crop({
  ...fromSeed(asparagusSeed, { canBeFermented: true }),
  name: 'Asparagus',
})
