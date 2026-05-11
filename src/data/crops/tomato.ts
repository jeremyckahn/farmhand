import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.tomatoSeed
 */
export const tomatoSeed: farmhand.item = crop({
  cropType: cropType.TOMATO,
  cropTimeline: [2, 1, 1, 1, 2, 2, 2],
  growsInto: 'tomato',
  id: 'tomato-seed',
  name: 'Tomato Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.tomato
 */
export const tomato: farmhand.item = crop({
  ...fromSeed(tomatoSeed, {
    canBeFermented: true,
  }),
  name: 'Tomato',
})
