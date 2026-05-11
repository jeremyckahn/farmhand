import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.watermelonSeed
 */
export const watermelonSeed: farmhand.item = crop({
  cropType: cropType.WATERMELON,
  cropTimeline: [2, 10],
  growsInto: 'watermelon',
  id: 'watermelon-seed',
  name: 'Watermelon Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.watermelon
 */
export const watermelon: farmhand.item = crop({
  ...fromSeed(watermelonSeed),
  name: 'Watermelon',
})
