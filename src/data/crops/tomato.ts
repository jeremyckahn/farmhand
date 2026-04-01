import { crop, fromSeed } from '../crop.ts'
import { cropType } from '../../enums.ts'

/**
 * @property farmhand.module:items.tomatoSeed
 * @type {farmhand.item}
 */
export const tomatoSeed = crop({
  cropType: cropType.TOMATO,
  cropTimeline: [2, 1, 1, 1, 2, 2, 2],
  growsInto: 'tomato',
  id: 'tomato-seed',
  name: 'Tomato Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.tomato
 * @type {farmhand.item}
 */
// @ts-expect-error
export const tomato = crop({
  // @ts-expect-error
  ...fromSeed(tomatoSeed, {
    canBeFermented: true,
  }),
  name: 'Tomato',
})
