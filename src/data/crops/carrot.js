/** @typedef {import("../../index").farmhand.item} item */

import { crop, fromSeed } from '../crop'
import { cropLifeStage, cropType } from '../../enums'

const { SEED, GROWING } = cropLifeStage

/**
 * @property farmhand.module:items.carrotSeed
 * @type {item}
 */
export const carrotSeed = crop({
  cropType: cropType.CARROT,
  cropTimetable: {
    [SEED]: 2,
    [GROWING]: [1, 1, 1],
  },
  growsInto: 'carrot',
  id: 'carrot-seed',
  name: 'Carrot Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.carrot
 * @type {item}
 */
export const carrot = crop({
  ...fromSeed(carrotSeed, { canBeFermented: true }),
  name: 'Carrot',
})
