import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.cornSeed
 * @type {farmhand.item}
 */
export const cornSeed = crop({
  cropType: cropType.CORN,
  cropTimetable: {
    [SEED]: 3,
    [GROWING]: 7,
  },
  growsInto: 'corn',
  playerId: 'corn-seed',
  name: 'Corn Kernels',
  tier: 2,
})

/**
 * @property farmhand.module:items.corn
 * @type {farmhand.item}
 */
export const corn = crop({
  ...fromSeed(cornSeed),
  name: 'Corn',
})
