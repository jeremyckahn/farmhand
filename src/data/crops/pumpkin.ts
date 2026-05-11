import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.pumpkinSeed
 */
export const pumpkinSeed: farmhand.item = crop({
  cropType: cropType.PUMPKIN,
  cropTimeline: [3, 1, 1, 1, 1, 1],
  growsInto: 'pumpkin',
  id: 'pumpkin-seed',
  name: 'Pumpkin Seed',
  tier: 1,
})

/**
 * @property farmhand.module:items.pumpkin
 */
export const pumpkin: farmhand.item = crop({
  ...fromSeed(pumpkinSeed, {
    canBeFermented: true,
  }),
  name: 'Pumpkin',
})
