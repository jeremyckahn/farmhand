import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.watermelonSeed
 */
export const watermelonSeed: farmhand.item = crop({
  cropType: cropType.WATERMELON,
  cropTimeline: [2, 10],
  growsInto: 'watermelon',
  highDemandSeasons: [season.SUMMER],
  id: 'watermelon-seed',
  lowDemandSeasons: [season.FALL, season.WINTER],
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
