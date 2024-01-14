/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.onionSeed
 * @type {farmhand.item}
 */
export const onionSeed = crop({
  cropType: cropType.ONION,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: [1, 2, 1],
  },
  growsInto: 'onion',
  id: 'onion-seed',
  name: 'Onion Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.onion
 * @type {farmhand.item}
 */
export const onion = crop({
  ...fromSeed(onionSeed, { canBeFermented: true }),
  name: 'Onion',
})
