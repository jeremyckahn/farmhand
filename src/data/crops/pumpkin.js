import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = crop({
  cropType: cropType.PUMPKIN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 5,
  },
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  name: 'Pumpkin Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const pumpkin = crop({
  ...fromSeed(pumpkinSeed),
  name: 'Pumpkin',
})
