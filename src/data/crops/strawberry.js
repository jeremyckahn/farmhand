import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

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
export const strawberry = crop({
  ...fromSeed(strawberrySeed),
  name: 'Strawberry',
})
