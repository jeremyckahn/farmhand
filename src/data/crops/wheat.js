import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.wheatSeed
 * @type {farmhand.item}
 */
export const wheatSeed = crop({
  cropType: cropType.WHEAT,
  cropTimetable: {
    [SEED]: 1,
    [GROWING]: [1],
  },
  growsInto: 'wheat',
  id: 'wheat-seed',
  name: 'Wheat Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.wheat
 * @type {farmhand.item}
 */
export const wheat = crop({
  ...fromSeed(wheatSeed),
  name: 'Wheat',
})
