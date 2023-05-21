import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.tomatoSeed
 * @type {farmhand.item}
 */
export const tomatoSeed = crop({
  cropType: cropType.TOMATO,
  cropTimetable: {
    [SEED]: 5,
    [GROWING]: 6,
  },
  growsInto: 'tomato',
  id: 'tomato-seed',
  name: 'Tomato Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.tomato
 * @type {farmhand.item}
 */
export const tomato = crop({
  ...fromSeed(tomatoSeed, { canBeFermented: true }),
  name: 'Tomato',
})
