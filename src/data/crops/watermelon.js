import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.watermelonSeed
 * @type {farmhand.item}
 */
export const watermelonSeed = crop({
  cropType: cropType.WATERMELON,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 10,
  },
  growsInto: 'watermelon',
  id: 'watermelon-seed',
  name: 'Watermelon Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.watermelon
 * @type {farmhand.item}
 */
export const watermelon = crop({
  ...fromSeed(watermelonSeed),
  name: 'Watermelon',
})
