/** @typedef {import("../../index").farmhand.item} farmhand.item */

import { crop, fromSeed } from '../crop'
import { cropType } from '../../enums'

/**
 * @property farmhand.module:items.peaSeed
 * @type {farmhand.item}
 */
export const peaSeed = crop({
  cropType: cropType.PEA,
  cropTimeline: [2, 3],
  growsInto: 'pea',
  id: 'pea-seed',
  name: 'Pea Seed',
  tier: 5,
})

/**
 * @property farmhand.module:items.pea
 * @type {farmhand.item}
 */
export const pea = crop({
  ...fromSeed(peaSeed, { canBeFermented: true }),
  name: 'Pea',
})
