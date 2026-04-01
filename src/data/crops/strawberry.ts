import { crop, fromSeed } from '../crop.ts'
import { cropType } from '../../enums.ts'

/**
 * @property farmhand.module:items.strawberrySeed
 * @type {farmhand.item}
 */
export const strawberrySeed = crop({
  cropType: cropType.STRAWBERRY,
  cropTimeline: [6, 2],
  growsInto: 'strawberry',
  id: 'strawberry-seed',
  name: 'Strawberry Seed',
  tier: 5,
})

/**
 * @property farmhand.module:items.strawberry
 * @type {farmhand.item}
 */
// @ts-expect-error
export const strawberry = crop({
  // @ts-expect-error
  ...fromSeed(strawberrySeed),
  name: 'Strawberry',
})
