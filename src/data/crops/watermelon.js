import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

/**
 * @property farmhand.module:items.watermelonSeed
 * @type {farmhand.item}
 */
export const watermelonSeed = crop({
  cropType: cropType.WATERMELON,
  cropTimeline: [2, 10],
  growsInto: 'watermelon',
  id: 'watermelon-seed',
  name: 'Watermelon Seed',
  tier: 4,
})

/**
 * @property farmhand.module:items.watermelon
 * @type {farmhand.item}
 */
export const watermelon = crop({
  ...fromSeed(watermelonSeed),
  name: 'Watermelon',
})
