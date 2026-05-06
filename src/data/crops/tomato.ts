import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.tomatoSeed

 */
export const tomatoSeed: any = crop({
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
export const tomato: any = crop({
  ...fromSeed(tomatoSeed, {
    canBeFermented: true,
  }),
  name: 'Tomato',
})
