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
    [GROWING]: 6,
  },
  growsInto: 'sweet-potato',
  playerId: 'sweet-potato-seed',
  name: 'Sweet Potato Slip',
  tier: 6,
})

/**
 * @property farmhand.module:items.sweetPotato
 * @type {farmhand.item}
 */
export const sweetPotato = crop({
  ...fromSeed(sweetPotatoSeed),
  name: 'Sweet Potato',
})
