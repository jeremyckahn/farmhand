/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.potatoSeed
 * @type {farmhand.item}
 */
export const potatoSeed = crop({
  cropType: cropType.POTATO,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: [1, 1, 1],
  },
  growsInto: 'potato',
  id: 'potato-seed',
  name: 'Potato Seeds',
  tier: 2,
})

/**
 * @property farmhand.module:items.potato
 * @type {farmhand.item}
 */
export const potato = crop({
  ...fromSeed(potatoSeed, { canBeFermented: true }),
  name: 'Potato',
})
