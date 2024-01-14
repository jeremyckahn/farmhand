/** @typedef {import('../../components/Farmhand/Farmhand').farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.sweetPotatoSeed
 * @type {farmhand.item}
 */
export const sweetPotatoSeed = crop({
  cropType: cropType.SWEET_POTATO,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: [1, 1, 2, 2],
  },
  growsInto: 'sweet-potato',
  id: 'sweet-potato-seed',
  name: 'Sweet Potato Slip',
  tier: 6,
})

/**
 * @property farmhand.module:items.sweetPotato
 * @type {farmhand.item}
 */
export const sweetPotato = crop({
  ...fromSeed(sweetPotatoSeed, { canBeFermented: true }),
  name: 'Sweet Potato',
})
