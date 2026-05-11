import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.strawberrySeed
 */
export const strawberrySeed: farmhand.item = crop({
  cropType: cropType.STRAWBERRY,
  cropTimeline: [6, 2],
  growsInto: 'strawberry',
  id: 'strawberry-seed',
  name: 'Strawberry Seed',
  tier: 5,
})

/**
 * @property farmhand.module:items.strawberry
 */
export const strawberry: farmhand.item = crop({
  ...fromSeed(strawberrySeed),
  name: 'Strawberry',
})
