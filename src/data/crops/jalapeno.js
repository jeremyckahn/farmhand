import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.jalapenoSeed
 * @type {farmhand.item}
 */
export const jalapenoSeed = crop({
  cropType: cropType.JALAPENO,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 3,
  },
  growsInto: 'jalapeno',
  id: 'jalapeno-seed',
  name: 'Jalapeño Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.jalapeno
 * @type {farmhand.item}
 */
export const jalapeno = crop({
  ...fromSeed(jalapenoSeed, { canBeFermented: true }),
  name: 'Jalapeño',
})
