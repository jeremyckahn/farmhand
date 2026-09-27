import { crop, fromSeed } from '../crop.js'
import { cropType, season } from '../../enums.js'

/**
 * @property farmhand.module:items.sunflowerSeed
 */
export const sunflowerSeed: farmhand.item = crop({
  cropType: cropType.SUNFLOWER,
  cropTimeline: [1, 1, 1, 1, 1, 1],
  growsInto: 'sunflower',
  highDemandSeasons: [season.SUMMER],
  id: 'sunflower-seed',
  lowDemandSeasons: [season.WINTER],
  name: 'Sunflower Seed',
  tier: 6,
})

/**
 * @property farmhand.module:items.sunflower
 */
export const sunflower: farmhand.item = crop({
  ...fromSeed(sunflowerSeed, {
    canBeFermented: true,
  }),
  name: 'Sunflower',
})
