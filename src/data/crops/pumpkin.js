import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.pumpkinSeed
 * @type {farmhand.item}
 */
export const pumpkinSeed = crop({
  cropType: cropType.PUMPKIN,
  cropTimeline: [3, 1, 1, 1, 1, 1],
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  name: 'Pumpkin Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.pumpkin
 * @type {farmhand.item}
 */
export const pumpkin = crop({
  ...fromSeed(pumpkinSeed, {
    canBeFermented: true,
  }),
  name: 'Pumpkin',
})
