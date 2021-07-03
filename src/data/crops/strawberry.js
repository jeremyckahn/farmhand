import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.strawberrySeed
 * @type {farmhand.item}
 */
export const strawberrySeed = crop({
  cropType: cropType.STRAWBERRY,
  cropTimetable: {
    [SEED]: 6,
    [GROWING]: 2,
  },
  growsInto: 'strawberry',
  id: 'strawberry-seed',
  name: 'Strawberry Seed',
  tier: 5,
})

/**
 * @property farmhand.module:items.strawberry
 * @type {farmhand.item}
 */
export const strawberry = crop({
  ...fromSeed(strawberrySeed),
  name: 'Strawberry',
})
