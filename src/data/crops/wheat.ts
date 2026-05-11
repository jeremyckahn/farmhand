import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.wheatSeed
 */
export const wheatSeed: farmhand.item = crop({
  cropType: cropType.WHEAT,
  cropTimeline: [1, 1],
  growsInto: 'wheat',
  id: 'wheat-seed',
  name: 'Wheat Seeds',
  tier: 3,
})

/**
 * @property farmhand.module:items.wheat
 */
export const wheat: farmhand.item = crop({
  ...fromSeed(wheatSeed),
  name: 'Wheat',
})
