import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

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
  ...fromSeed(peaSeed, {
    canBeFermented: true,
  }),
  name: 'Pea',
})
