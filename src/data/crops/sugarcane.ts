import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

// TODO: Ask Jeremy about reshuffling crop unlock order — sugar is used in
// enough recipes that sugarcane may be worth introducing earlier than level 44.
/**
 * @property farmhand.module:items.sugarcaneSeed
 */
export const sugarcaneSeed: farmhand.item = crop({
  cropType: cropType.SUGARCANE,
  cropTimeline: [2, 2, 3],
  growsInto: 'sugarcane',
  id: 'sugarcane-seed',
  name: 'Sugarcane Seed',
  tier: 7,
})

/**
 * @property farmhand.module:items.sugarcane
 */
export const sugarcane: farmhand.item = crop({
  ...fromSeed(sugarcaneSeed),
  name: 'Sugarcane',
})
