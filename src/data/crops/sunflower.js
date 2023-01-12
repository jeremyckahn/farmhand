import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.sunflowerSeed
 * @type {farmhand.item}
 */
export const sunflowerSeed = crop({
  cropType: cropType.SUNFLOWER,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 3,
  },
  growsInto: 'sunflower',
  id: 'sunflower-seed',
  name: 'Sunflower Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.sunflower
 * @type {farmhand.item}
 */
export const sunflower = crop({
  ...fromSeed(sunflowerSeed),
  name: 'Sunflower',
})
