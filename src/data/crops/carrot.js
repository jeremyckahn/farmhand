/** @typedef {import("../../index").farmhand.item} item */

import { crop, fromSeed } from '../crop'
import { cropType } from '../../enums'

/**
 * @property farmhand.module:items.carrotSeed
 * @type {item}
 */
export const carrotSeed = crop({
  cropType: cropType.CARROT,
  cropTimeline: [2, 1, 1, 1],
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
