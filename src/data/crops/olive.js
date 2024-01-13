import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.oliveSeed
 * @type {farmhand.item}
 */
export const oliveSeed = crop({
  cropType: cropType.OLIVE,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: [6],
  },
  growsInto: 'olive',
  id: 'olive-seed',
  name: 'Olive Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.olive
 * @type {farmhand.item}
 */
export const olive = crop({
  ...fromSeed(oliveSeed, { canBeFermented: true }),
  name: 'Olive',
})
