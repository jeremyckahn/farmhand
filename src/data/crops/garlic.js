import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.garlicSeed
 * @type {farmhand.item}
 */
export const garlicSeed = crop({
  cropType: cropType.GARLIC,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: [3],
  },
  growsInto: 'garlic',
  id: 'garlic-seed',
  name: 'Garlic Bulb',
  tier: 5,
})

/**
 * @property farmhand.module:items.garlic
 * @type {farmhand.item}
 */
export const garlic = crop({
  ...fromSeed(garlicSeed, { canBeFermented: true }),
  name: 'Garlic',
})
