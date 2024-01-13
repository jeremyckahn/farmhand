import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.peaSeed
 * @type {farmhand.item}
 */
export const peaSeed = crop({
  cropType: cropType.PEA,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: [3],
  },
  growsInto: 'pea',
  id: 'pea-seed',
  name: 'Pea Seed',
  tier: 5,
})

/**
 * @property farmhand.module:items.pea
 * @type {farmhand.item}
 */
export const pea = crop({
  ...fromSeed(peaSeed, { canBeFermented: true }),
  name: 'Pea',
})
