import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.spinachSeed
 * @type {farmhand.item}
 */
export const spinachSeed = crop({
  cropType: cropType.SPINACH,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: 4,
  },
  growsInto: 'spinach',
  playerId: 'spinach-seed',
  name: 'Spinach Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.spinach
 * @type {farmhand.item}
 */
export const spinach = crop({
  ...fromSeed(spinachSeed),
  name: 'Spinach',
})
